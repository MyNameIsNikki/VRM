const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('data/db.json');
const db = lowdb(adapter);

// Middleware для проверки токена
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, 'secret_key', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Получение истории покупок пользователя
router.get('/user/:user_id', authenticateToken, (req, res) => {
  const orders = db.get('orders').filter({ 'id pookypatelya': parseInt(req.params.user_id) }).value();
  const purchaseHistory = db.get('purchase_history').value();
  const userPurchaseHistory = purchaseHistory.filter((purchase) =>
    orders.some((order) => order['id zakaza'] === purchase['id zakaza'])
  );
  res.json(userPurchaseHistory);
});

module.exports = router;    