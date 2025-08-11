const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db'); // ← подключение к PostgreSQL

// Регистрация пользователя
router.post('/register', async (req, res) => {
  console.log(req.body);
  const { login, password, link } = req.body;
  if (!login || !password || !link) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  try {
    const userCheck = await pool.query('SELECT * FROM users WHERE login = $1', [login]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Login already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      'INSERT INTO users (login, password, link) VALUES ($1, $2, $3) RETURNING *',
      [login, hashedPassword, link]
    );

    const user = newUser.rows[0];

    await pool.query(
      'INSERT INTO sellers (link, id_polz) VALUES ($1, $2)',
      [user.link, user.id]
    );

    res.status(201).json({ id: user.id, login: user.login, link: user.link });
  } catch (error) {
  console.error('Ошибка регистрации:', error.message, error.stack);
  res.status(500).json({ 
    error: 'Registration failed',
    details: error.message  // ← Добавьте эту строку
  });
}
});

// Логин пользователя
router.post('/login', async (req, res) => {
  const { login, password } = req.body;
  try {
    const userResult = await pool.query('SELECT * FROM users WHERE login = $1', [login]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user.id, login: user.login }, 'secret_key', { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, login: user.login, link: user.link } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;