const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

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

// Регистрация пользователя
router.post('/register', validateRegister, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { login, password, link } = req.body;
  try {
    const pool = req.app.locals.pool;
    const userCheck = await pool.query('SELECT * FROM users WHERE login = $1', [login]);
    
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Пользователь с таким логином уже существует' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      'INSERT INTO users (login, password, link) VALUES ($1, $2, $3) RETURNING id, login, link',
      [login, hashedPassword, link]
    );

    const user = newUser.rows[0];
    await pool.query(
      'INSERT INTO sellers (link, id_polz) VALUES ($1, $2)',
      [user.link, user.id]
    );

    const token = jwt.sign({ id: user.id, login: user.login }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token, user });
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    res.status(500).json({ error: 'Ошибка сервера при регистрации' });
  }
});

// Логин пользователя
router.post('/login', validateLogin, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { login, password } = req.body;
  try {
    const pool = req.app.locals.pool;
    const userResult = await pool.query('SELECT * FROM users WHERE login = $1', [login]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    const user = userResult.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Неверный пароль' });
    }

    const token = jwt.sign({ id: user.id, login: user.login }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        login: user.login, 
        link: user.link 
      } 
    });
  } catch (error) {
    console.error('Ошибка входа:', error);
    res.status(500).json({ error: 'Ошибка сервера при входе' });
  }
});

module.exports = router;