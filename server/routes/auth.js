const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('data/db.json');
const db = lowdb(adapter);

// Регистрация пользователя
router.post('/register', async (req, res) => {
  const { login, password, link } = req.body;
  try {
    const existingUser = db.get('users').find({ login }).value();
    if (existingUser) return res.status(400).json({ error: 'Login already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: Date.now(),
      login,
      password: hashedPassword,
      link,
      flag: false,
      registrationtime: new Date().toISOString()
    };
    db.get('users').push(user).write();

    // Создаём продавца, если пользователь хочет быть продавцом
    const seller = {
      id_prodavca: Date.now(),
      link: user.link,
      id_polz: user.id
    };
    db.get('sellers').push(seller).write();

    res.status(201).json({ id: user.id, login, link });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Логин пользователя
router.post('/login', async (req, res) => {
  const { login, password } = req.body;
  try {
    const user = db.get('users').find({ login }).value();
    if (!user) return res.status(404).json({ error: 'User not found' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user.id, login: user.login }, 'secret_key', { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, login: user.login, link: user.link } });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;