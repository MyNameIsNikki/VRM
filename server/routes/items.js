const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

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

// Получение всех товаров
router.get('/', async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const result = await pool.query(`
      SELECT i.*, u.login as seller_name 
      FROM items i
      JOIN users u ON i.id_prodavca = u.id
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка получения товаров:', error);
    res.status(500).json({ error: 'Ошибка сервера при получении товаров' });
  }
});

// Получение товара по ID
router.get('/:id', async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const result = await pool.query(`
      SELECT i.*, u.login as seller_name 
      FROM items i
      JOIN users u ON i.id_prodavca = u.id
      WHERE i.id = $1
    `, [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Товар не найден' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка получения товара:', error);
    res.status(500).json({ error: 'Ошибка сервера при получении товара' });
  }
});

// Добавление нового товара
router.post('/add', authenticateToken, [
  check('nazvanie').notEmpty().withMessage('Название обязательно'),
  check('price').isFloat({ gt: 0 }).withMessage('Цена должна быть положительным числом'),
  check('ka4estvo').notEmpty().withMessage('Качество обязательно')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { nazvanie, price, ka4estvo } = req.body;
  try {
    const pool = req.app.locals.pool;
    const result = await pool.query(
      `INSERT INTO items 
      (id_prodavca, nazvanie, price, ka4estvo, timevblstav) 
      VALUES ($1, $2, $3, $4, NOW()) 
      RETURNING *`,
      [req.user.id, nazvanie, price, ka4estvo]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка добавления товара:', error);
    res.status(500).json({ error: 'Ошибка сервера при добавлении товара' });
  }
});

module.exports = router;