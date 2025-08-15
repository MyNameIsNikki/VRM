const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

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
    const itemResult = await pool.query('SELECT * FROM items WHERE id = $1', [item_id]);
    if (itemResult.rows.length === 0) {
      return res.status(404).json({ error: 'Товар не найден' });
    }
    const item = itemResult.rows[0];

    // Получаем пользователя
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    const user = userResult.rows[0];

    // Создаем заказ
    const orderResult = await pool.query(
      `INSERT INTO orders 
      (id_pookypatelya, id_prodavca, id_item, price, link, datazakaza, name) 
      VALUES ($1, $2, $3, $4, $5, NOW(), $6) 
      RETURNING *`,
      [req.user.id, item.id_prodavca, item.id, item.price, user.link, item.nazvanie]
    );
    const order = orderResult.rows[0];

    // Добавляем в историю покупок
    await pool.query(
      'INSERT INTO purchase_history (id_zakaza) VALUES ($1)',
      [order.id]
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
    const result = await pool.query(`
      SELECT o.*, i.nazvanie as item_name, u.login as seller_name 
      FROM orders o
      JOIN items i ON o.id_item = i.id
      JOIN users u ON o.id_prodavca = u.id
      WHERE o.id_pookypatelya = $1
    `, [req.params.user_id]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка получения заказов:', error);
    res.status(500).json({ error: 'Ошибка сервера при получении заказов' });
  }
});

module.exports = router;