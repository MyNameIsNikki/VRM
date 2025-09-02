const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const pool = require('../db');
const winston = require('winston');

// Настройка логгера
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'auth.log' })
  ]
});

// Валидация регистрации
const validateRegister = [
  check('login').isLength({ min: 3 }).withMessage('Логин должен быть не менее 3 символов'),
  check('password').isLength({ min: 6 }).withMessage('Пароль должен быть не менее 6 символов'),
  check('link').isURL().withMessage('Неверный формат ссылки')
];

// Валидация входа
const validateLogin = [
  check('login').notEmpty().withMessage('Логин обязателен'),
  check('password').notEmpty().withMessage('Пароль обязателен')
];

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
    logger.info(`Таблица "${tableName}": ${exists ? 'найдена' : 'отсутствует'}`);
    
    if (exists) {
      const countRes = await client.query(`SELECT COUNT(*) FROM public.users`);
      logger.info(`Записей в таблице "${tableName}": ${countRes.rows[0].count}`);
      
      const dataRes = await client.query(`SELECT * FROM public.users ORDER BY id LIMIT 10`);
      logger.info('Содержимое таблицы:', { table: tableName });
      if (dataRes.rows.length === 0) {
        logger.info('Нет данных в таблице.', { table: tableName });
      } else {
        dataRes.rows.forEach((row, index) => {
          logger.info(`Запись ${index + 1}:`, { table: tableName, row });
        });
        if (countRes.rows[0].count > 10) {
          logger.info(`...и еще ${countRes.rows[0].count - 10} записей`, { table: tableName });
        }
      }
    } else {
      const tablesRes = await client.query(
        `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`
      );
      logger.info('Доступные таблицы в схеме public:', {
        tables: tablesRes.rows.map(row => row.table_name).join(', ') || 'нет таблиц'
      });
    }
  } catch (tableError) {
    logger.error(`Ошибка проверки таблицы "${tableName}"`, {
      error: tableError.message,
      stack: tableError.stack
    });
  }
}

// Регистрация пользователя
router.post('/register', validateRegister, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { login, password, link } = req.body;
  
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Детальная диагностика - что приходит в запросе
    console.log('Registration attempt:', { login, password, link });
    
    // Проверяем существование пользователя с правильными именами таблиц
    const userCheck = await client.query(
      'SELECT * FROM "users" WHERE login = $1 OR link = $2', 
      [login, link]
    );
    
    console.log('User check result:', userCheck.rows);
    
    if (userCheck.rows.length > 0) {
      await client.query('ROLLBACK');
      const existingUser = userCheck.rows[0];
      if (existingUser.login === login) {
        return res.status(400).json({ error: 'Пользователь с таким логином уже существует' });
      } else {
        return res.status(400).json({ error: 'Пользователь с такой ссылкой уже существует' });
      }
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully');
    
    // Создаем пользователя
    const newUser = await client.query(
      'INSERT INTO "users" (login, password, link, registrationtime) VALUES ($1, $2, $3, CURRENT_DATE) RETURNING id, login, link',
      [login, hashedPassword, link]
    );

    console.log('User created:', newUser.rows[0]);
    
    const user = newUser.rows[0];
    
    // Создаем запись продавца
    const sellerResult = await client.query(
      'INSERT INTO "sellers" (link, id_polz) VALUES ($1, $2) RETURNING *',
      [user.link, user.id]
    );
    
    console.log('Seller created:', sellerResult.rows[0]);

    await client.query('COMMIT');
    console.log('Transaction committed successfully');

    const token = jwt.sign({ id: user.id, login: user.login }, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    // Проверяем, что данные действительно сохранились
    const verifyUser = await client.query('SELECT * FROM "users" WHERE id = $1', [user.id]);
    const verifySeller = await client.query('SELECT * FROM "sellers" WHERE id_polz = $1', [user.id]);
    
    console.log('Verification - User exists:', verifyUser.rows.length > 0);
    console.log('Verification - Seller exists:', verifySeller.rows.length > 0);
    
    res.status(201).json({ 
      token, 
      user: {
        id: user.id,
        login: user.login,
        link: user.link
      } 
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    
    console.error('Registration error details:', {
      message: error.message,
      code: error.code,
      detail: error.detail,
      constraint: error.constraint,
      stack: error.stack
    });
    
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Логин или ссылка уже используются' });
    }
    
    res.status(500).json({ 
      error: 'Ошибка сервера при регистрации',
      details: error.message 
    });
  } finally {
    client.release();
  }
});

// Логин пользователя
router.post('/login', validateLogin, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Валидация входа не пройдена', { errors: errors.array() });
    return res.status(400).json({ errors: errors.array() });
  }

  const { login, password } = req.body;
  logger.info('Попытка входа пользователя', { login });

  let client;
  try {
    client = await pool.connect();
    
    const userResult = await client.query('SELECT * FROM users WHERE login = $1', [login]);
    
    if (userResult.rows.length === 0) {
      logger.warn('Пользователь не найден', { login });
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    const user = userResult.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      logger.warn('Неверный пароль', { login });
      return res.status(401).json({ error: 'Неверный пароль' });
    }

    if (!process.env.JWT_SECRET) {
      logger.error('JWT_SECRET не установлен');
      return res.status(500).json({ error: 'Ошибка сервера: JWT_SECRET не настроен' });
    }

    const token = jwt.sign({ id: user.id, login: user.login }, process.env.JWT_SECRET, { expiresIn: '24h' });
    logger.info('Пользователь успешно вошел', { userId: user.id, login });
    
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        login: user.login, 
        link: user.link 
      } 
    });
  } catch (error) {
    logger.error('Ошибка входа', {
      error: error.message,
      stack: error.stack,
      login
    });
    res.status(500).json({ error: 'Ошибка сервера при входе' });
  } finally {
    if (client) {
      client.release();
    }
  }
});

// CLI mode
async function runCLIMode() {
  logger.info('Попытка подключения к базе данных');
  let client;
  try {
    client = await pool.connect();
    logger.info('Подключение к БД успешно установлено');
    
    await logTableInfo(client, 'users');
    
    logger.info('Все проверки завершены');
  } catch (error) {
    logger.error('Ошибка подключения', {
      error: error.message,
      stack: error.stack,
      code: error.code
    });
    
    if (error.code) {
      logger.error('Возможные причины ошибки', {
        code: error.code,
        details: {
          'ECONNREFUSED': 'Сервер БД не запущен или недоступен, проверьте порт и хост',
          '28P01': 'Неверное имя пользователя или пароль',
          '3D000': `База данных не существует: ${process.env.DB_NAME || 'не указано'}`,
          'ENOTFOUND': 'Сервер БД не найден (проверьте хост)',
          'ETIMEDOUT': 'Таймаут подключения (проверьте доступность сервера)'
        }[error.code] || 'Неизвестная ошибка, проверьте параметры подключения'
      });
    }
  } finally {
    if (client) client.release();
    logger.info('Завершение работы с пулом соединений');
    await pool.end();
    logger.info('Скрипт завершен');
  }
}

if (require.main === module) {
  runCLIMode().catch(err => {
    logger.error('Ошибка выполнения скрипта', { error: err.message });
    process.exit(1);
  });
}

module.exports = router;