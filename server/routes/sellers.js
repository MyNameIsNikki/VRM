/*Запуск для проверки из server node routes/sellers.js */
const express = require('express');
const router = express.Router();
delete require.cache[require.resolve('../db')];
const pool = require('../db');

// Отладка: вывод переменных окружения
console.log('Environment variables for sellers.js:', {
  DB_USER: process.env.DB_USER,
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  DB_PASSWORD: process.env.DB_PASSWORD ? '[REDACTED]' : undefined,
  DB_PORT: process.env.DB_PORT
});

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
      const countRes = await client.query(`SELECT COUNT(*) FROM public."sellers"`);
      console.log(`  Записей: ${countRes.rows[0].count}`);
      
      const dataRes = await client.query(`SELECT * FROM public."sellers" ORDER BY id_prodavca LIMIT 10`);
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

// Получение всех продавцов
router.get('/', async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const result = await pool.query(`
      SELECT s.*, u.login 
      FROM public."sellers" s
      JOIN public."users" u ON s.id_polz = u.id
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка получения продавцов:', error);
    res.status(500).json({ error: 'Ошибка сервера при получении продавцов' });
  }
});

// Получение продавца по ID пользователя
router.get('/user/:user_id', async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const result = await pool.query(`
      SELECT s.*, u.login 
      FROM public."sellers" s
      JOIN public."users" u ON s.id_polz = u.id
      WHERE s.id_polz = $1
    `, [req.params.user_id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Продавец не найден' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка получения продавца:', error);
    res.status(500).json({ error: 'Ошибка сервера при получении продавца' });
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
    
    await logTableInfo(client, 'sellers');
    
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