/*Запуск для проверки из server node routes/orders.js */
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
delete require.cache[require.resolve('../db')];
const pool = require('../db');

// Отладка: вывод переменных окружения
console.log('Environment variables for orders.js:', {
  DB_USER: process.env.DB_USER,
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  DB_PASSWORD: process.env.DB_PASSWORD ? '[REDACTED]' : undefined,
  DB_PORT: process.env.DB_PORT
});

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
      const countRes = await client.query(`SELECT COUNT(*) FROM public."zakaz"`);
      console.log(`  Записей: ${countRes.rows[0].count}`);
      
      const dataRes = await client.query(
        `SELECT id_zakaza, id_pokupatelya, id_prodavca, datazakaza, name, id_item, price::text 
         FROM public."zakaz" 
         ORDER BY id_zakaza 
         LIMIT 10`
      );
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

// Создание заказа
router.post('/create', authenticateToken, [
  check('item_id').isInt().withMessage('ID товара должен быть числом')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { item_id } = req.body;
  try {
    const pool = req.app.locals.pool;
    
    // Получаем товар
    const itemResult = await pool.query(
      `SELECT id_item, id_prodavca, nazvanie, price 
       FROM public."skins" 
       WHERE id_item = $1`,
      [item_id]
    );
    if (itemResult.rows.length === 0) {
      return res.status(404).json({ error: 'Товар не найден' });
    }
    const item = itemResult.rows[0];

    // Получаем пользователя
    const userResult = await pool.query(
      `SELECT id, link 
       FROM public."users" 
       WHERE id = $1`,
      [req.user.id]
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    const user = userResult.rows[0];

    // Создаем заказ
    const orderResult = await pool.query(
      `INSERT INTO public."zakaz" 
      (id_pokupatelya, id_prodavca, id_item, price, name, datazakaza) 
      VALUES ($1, $2, $3, $4, $5, CURRENT_DATE) 
      RETURNING id_zakaza, id_pokupatelya, id_prodavca, id_item, price::text, name, datazakaza`,
      [req.user.id, item.id_prodavca, item.id_item, item.price, item.nazvanie]
    );
    const order = orderResult.rows[0];

    // Добавляем в историю покупок
    await pool.query(
      `INSERT INTO public."history" 
      (id_zakaza, id_item, id_pokupatelya) 
      VALUES ($1, $2, $3)`,
      [order.id_zakaza, item.id_item, req.user.id]
    );

    res.status(201).json(order);
  } catch (error) {
    console.error('Ошибка создания заказа:', error);
    res.status(500).json({ error: 'Ошибка сервера при создании заказа' });
  }
});

// Получение заказов пользователя
router.get('/user/:user_id', authenticateToken, async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const result = await pool.query(
      `SELECT o.id_zakaza, o.id_pokupatelya, o.id_prodavca, o.datazakaza, o.name, o.id_item, o.price::text, 
              i.nazvanie as item_name, u.login as seller_name 
       FROM public."zakaz" o
       JOIN public."skins" i ON o.id_item = i.id_item
       JOIN public."sellers" s ON o.id_prodavca = s.id_prodavca
       JOIN public."users" u ON s.id_polz = u.id
       WHERE o.id_pokupatelya = $1`,
      [req.params.user_id]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка получения заказов:', error);
    res.status(500).json({ error: 'Ошибка сервера при получении заказов' });
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
    
    await logTableInfo(client, 'zakaz');
    
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