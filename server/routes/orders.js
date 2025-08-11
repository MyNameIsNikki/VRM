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

// Создание заказа
router.post('/create', authenticateToken, (req, res) => {
  const { item_id } = req.body;
  const item = db.get('items').find({ id: item_id }).value();
  if (!item) return res.status(404).json({ error: 'Item not found' });

  const user = db.get('users').find({ id: req.user.id }).value();
  const seller = db.get('sellers').find({ id_prodavca: item.id_prodavca }).value();

  const order = {
    'id zakaza': Date.now(),
    'id pookypatelya': req.user.id,
    'id prodavca': item.id_prodavca,
    'id item': item.id,
    price: item.price,
    link: user.link,
    datazakaza: new Date().toISOString(),
    name: item.nazvanie
  };
  db.get('orders').push(order).write();

  // Добавление в историю покупок
  const purchase = {
    'id pokypki': Date.now(),
    'id zakaza': order['id zakaza']
  };
  db.get('purchase_history').push(purchase).write();

  res.json(order);
});

// Получение заказов пользователя
router.get('/user/:user_id', authenticateToken, (req, res) => {
  const orders = db.get('orders').filter({ 'id pookypatelya': parseInt(req.params.user_id) }).value();
  res.json(orders);
});

module.exports = router;