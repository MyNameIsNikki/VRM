const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const pool = require('../db');

// Middleware для проверки токена
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Токен не предоставлен' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Недействительный токен' });
    req.user = user;
    next();
  });
};

// Функция для проверки таблицы и вывода всех колонок
async function logTableInfo(client, tableName) {
  try {
    const checkRes = await client.query(
      `SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = $1
      )`,
      [tableName.toLowerCase()]
    );
    
    const exists = checkRes.rows[0].exists;
    console.log(`- Таблица "${tableName}": ${exists ? '✓ найдена' : '✗ отсутствует'}`);
    
    if (exists) {
      const countRes = await client.query(`SELECT COUNT(*) FROM public."skins"`);
      console.log(`  Записей: ${countRes.rows[0].count}`);
      
      const dataRes = await client.query(`SELECT id_item, id_prodavca, kachestvo, price::text, nazvanie, timevystav FROM public."skins" ORDER BY id_item LIMIT 10`);
      console.log('  Содержимое таблицы:');
      if (dataRes.rows.length === 0) {
        console.log('    Нет данных в таблице.');
      } else {
        dataRes.rows.forEach((row, index) => {
          console.log(`    Запись ${index + 1}:`, JSON.stringify(row));
        });
        if (countRes.rows[0].count > 10) {
          console.log(`    ...и еще ${countRes.rows[0].count - 10} записей`);
        }
      }
    } else {
      const tablesRes = await client.query(
        `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`
      );
      console.log('  Доступные таблицы в схеме public:', tablesRes.rows.map(row => row.table_name).join(', ') || 'нет таблиц');
    }
  } catch (tableError) {
    console.error(`  Ошибка проверки таблицы "${tableName}":`, tableError.message);
    try {
      const tablesRes = await client.query(
        `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`
      );
      console.log('  Доступные таблицы в схеме public:', tablesRes.rows.map(row => row.table_name).join(', ') || 'нет таблиц');
    } catch (diagError) {
      console.error('  Ошибка при получении списка таблиц:', diagError.message);
    }
  }
}

// Получение всех товаров
router.get('/', async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query(`
      SELECT i.id_item, i.id_prodavca, i.kachestvo, i.price::text as price, i.nazvanie, i.timevystav, u.login as seller_name 
      FROM public."skins" i
      JOIN public."sellers" s ON i.id_prodavca = s.id_prodavca
      JOIN public."users" u ON s.id_polz = u.id
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка получения товаров:', error);
    res.status(500).json({ error: 'Ошибка сервера при получении товаров' });
  } finally {
    if (client) client.release();
  }
});

// Получение товара по ID
router.get('/:id', async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query(`
      SELECT i.id_item, i.id_prodavca, i.kachestvo, i.price::text as price, i.nazvanie, i.timevystav, u.login as seller_name 
      FROM public."skins" i
      JOIN public."sellers" s ON i.id_prodavca = s.id_prodavca
      JOIN public."users" u ON s.id_polz = u.id
      WHERE i.id_item = $1
    `, [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Товар не найден' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка получения товара:', error);
    res.status(500).json({ error: 'Ошибка сервера при получении товара' });
  } finally {
    if (client) client.release();
  }
});

// Добавление нового товара
router.post('/add', authenticateToken, [
  check('nazvanie').notEmpty().withMessage('Название обязательно'),
  check('price').isFloat({ gt: 0 }).withMessage('Цена должна быть положительным числом'),
  check('kachestvo').notEmpty().withMessage('Качество обязательно')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { nazvanie, price, kachestvo } = req.body;
  let client;
  
  try {
    client = await pool.connect();
    
    // Получаем id продавца по id пользователя
    const sellerResult = await client.query('SELECT id_prodavca FROM public."sellers" WHERE id_polz = $1', [req.user.id]);
    if (sellerResult.rows.length === 0) {
      return res.status(403).json({ error: 'Пользователь не является продавцом' });
    }
    const id_prodavca = sellerResult.rows[0].id_prodavca;

    const result = await client.query(
      `INSERT INTO public."skins" 
      (id_prodavca, nazvanie, price, kachestvo, timevystav) 
      VALUES ($1, $2, $3, $4, CURRENT_DATE) 
      RETURNING id_item, id_prodavca, nazvanie, price::text, kachestvo, timevystav`,
      [id_prodavca, nazvanie, price, kachestvo]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка добавления товара:', error);
    res.status(500).json({ error: 'Ошибка сервера при добавлении товара' });
  } finally {
    if (client) client.release();
  }
});

// CLI mode
async function runCLIMode() {
  console.log('Попытка подключения к базе данных...');
  let client;
  try {
    if (!process.env.DB_PASSWORD) {
      throw new Error('Переменная окружения DB_PASSWORD не установлена или пуста');
    }
    client = await pool.connect();
    console.log('✓ Подключение к БД успешно установлено');
    
    await logTableInfo(client, 'skins');
    
    console.log('\n✓ Все проверки завершены');
  } catch (error) {
    console.error('\n✗ Ошибка подключения:', error.message);
    console.error('Стек ошибки:', error.stack);
    
    if (error.message.includes('client password must be a string')) {
      console.error('Проблема: Пароль для базы данных не является строкой');
      console.error('Решение: Проверьте переменную DB_PASSWORD в .env файле или конфигурацию db.js');
    } else if (error.code) {
      console.error('\nКод ошибки:', error.code);
      console.error('Возможные причины:');
      switch (error.code) {
        case 'ECONNREFUSED':
          console.error('- Сервер БД не запущен или недоступен');
          console.error('- Неправильный порт или хост');
          break;
        case '28P01':
          console.error('- Неверное имя пользователя или пароль');
          break;
        case '3D000':
          console.error('- База данных не существует');
          console.error(`- Проверьте имя БД: ${process.env.DB_NAME || 'не указано'}`);
          break;
        case 'ENOTFOUND':
          console.error('- Сервер БД не найден (проверьте хост)');
          break;
        case 'ETIMEDOUT':
          console.error('- Таймаут подключения (проверьте доступность сервера)');
          break;
        default:
          console.error('- Неизвестная ошибка, проверьте параметры подключения');
      }
    }
  } finally {
    if (client) client.release();
    console.log('\nЗавершение работы с пулом соединений');
    await pool.end();
    console.log('Скрипт завершен');
  }
}

if (require.main === module) {
  runCLIMode().catch(err => {
    console.error('Ошибка выполнения скрипта:', err.message);
    process.exit(1);
  });
}

module.exports = router;