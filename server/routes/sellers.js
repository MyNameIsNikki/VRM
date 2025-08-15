const express = require('express');
const router = express.Router();

// Получение всех продавцов
router.get('/', async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const result = await pool.query(`
      SELECT s.*, u.login 
      FROM sellers s
      JOIN users u ON s.id_polz = u.id
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
      FROM sellers s
      JOIN users u ON s.id_polz = u.id
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

module.exports = router;