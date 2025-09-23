const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const pool = require('../db');
const winston = require('winston');

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

const validateRegister = [
  check('username').isLength({ min: 3 }).withMessage('Логин должен быть не менее 3 символов'),
  check('email').isEmail().withMessage('Неверный формат email'),
  check('password').isLength({ min: 6 }).withMessage('Пароль должен быть не менее 6 символов')
];

const validateLogin = [
  check('username').notEmpty().withMessage('Логин обязателен'),
  check('password').notEmpty().withMessage('Пароль обязателен')
];

// POST регистрация
router.post('/register', validateRegister, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;
  
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    const userCheck = await client.query(
      'SELECT * FROM "users" WHERE login = $1 OR link = $2', 
      [username, email]
    );
    
    if (userCheck.rows.length > 0) {
      await client.query('ROLLBACK');
      const existingUser = userCheck.rows[0];
      if (existingUser.login === username) {
        return res.status(400).json({ error: 'Пользователь с таким логином уже существует' });
      } else {
        return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await client.query(
      'INSERT INTO "users" (login, password, link, registrationtime) VALUES ($1, $2, $3, CURRENT_DATE) RETURNING id, login, link',
      [username, hashedPassword, email]
    );

    const user = newUser.rows[0];
    
    await client.query(
      'INSERT INTO "sellers" (link, id_polz) VALUES ($1, $2) RETURNING *',
      [user.link, user.id]
    );

    await client.query('COMMIT');

    const token = jwt.sign({ id: user.id, login: user.login }, process.env.JWT_SECRET, { expiresIn: '24h' });
    
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
      return res.status(400).json({ error: 'Логин или email уже используются' });
    }
    
    res.status(500).json({ 
      error: 'Ошибка сервера при регистрации',
      details: error.message 
    });
  } finally {
    client.release();
  }
});

// POST логин
router.post('/login', validateLogin, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Валидация входа не пройдена', { errors: errors.array() });
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;
  logger.info('Попытка входа пользователя', { username });

  let client;
  try {
    client = await pool.connect();
    
    const userResult = await client.query('SELECT * FROM users WHERE login = $1', [username]);
    
    if (userResult.rows.length === 0) {
      logger.warn('Пользователь не найден', { username });
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    const user = userResult.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      logger.warn('Неверный пароль', { username });
      return res.status(401).json({ error: 'Неверный пароль' });
    }

    if (!process.env.JWT_SECRET) {
      logger.error('JWT_SECRET не установлен');
      return res.status(500).json({ error: 'Ошибка сервера: JWT_SECRET не настроен' });
    }

    const token = jwt.sign({ id: user.id, login: user.login }, process.env.JWT_SECRET, { expiresIn: '24h' });
    logger.info('Пользователь успешно вошел', { userId: user.id, username });
    
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
      username
    });
    res.status(500).json({ error: 'Ошибка сервера при входе' });
  } finally {
    if (client) {
      client.release();
    }
  }
});

// GET логин - исправленный вариант
router.get('/login', async (req, res) => {
  const { username, password } = req.query;
  logger.info('Попытка входа пользователя (GET)', { username });

  // Валидация вручную для GET-запроса
  if (!username || !password) {
    return res.status(400).json({ 
      errors: [
        { 
          msg: !username ? 'Логин обязателен' : 'Пароль обязателен',
          param: !username ? 'username' : 'password'
        }
      ] 
    });
  }

  let client;
  try {
    client = await pool.connect();
    
    const userResult = await client.query('SELECT * FROM users WHERE login = $1', [username]);
    
    if (userResult.rows.length === 0) {
      logger.warn('Пользователь не найден (GET)', { username });
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    const user = userResult.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      logger.warn('Неверный пароль (GET)', { username });
      return res.status(401).json({ error: 'Неверный пароль' });
    }

    if (!process.env.JWT_SECRET) {
      logger.error('JWT_SECRET не установлен (GET)');
      return res.status(500).json({ error: 'Ошибка сервера: JWT_SECRET не настроен' });
    }

    const token = jwt.sign({ id: user.id, login: user.login }, process.env.JWT_SECRET, { expiresIn: '24h' });
    logger.info('Пользователь успешно вошел (GET)', { userId: user.id, username });
    
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        login: user.login, 
        link: user.link 
      } 
    });
  } catch (error) {
    logger.error('Ошибка входа (GET)', {
      error: error.message,
      stack: error.stack,
      username
    });
    res.status(500).json({ error: 'Ошибка сервера при входе' });
  } finally {
    if (client) {
      client.release();
    }
  }
});

module.exports = router;