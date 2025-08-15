const express = require('express');
const router = express.Router();
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

// Получение истории покупок пользователя
router.get('/user/:user_id', authenticateToken, async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const result = await pool.query(`
      SELECT ph.*, o.name as item_name, o.price, o.datazakaza, u.login as seller_name
      FROM purchase_history ph
      JOIN orders o ON ph.id_zakaza = o.id
      JOIN users u ON o.id_prodavca = u.id
      WHERE o.id_pookypatelya = $1
    `, [req.params.user_id]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка получения истории покупок:', error);
    res.status(500).json({ error: 'Ошибка сервера при получении истории покупок' });
  }
});

module.exports = router;