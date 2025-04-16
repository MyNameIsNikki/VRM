const express = require('express');
const router = express.Router();
const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('data/db.json');
const db = lowdb(adapter);

// Получение всех товаров
router.get('/', (req, res) => {
  const items = db.get('items').value();
  res.json(items);
});

// Получение товара по ID
router.get('/:id', (req, res) => {
  const item = db.get('items').find({ id: parseInt(req.params.id) }).value();
  if (!item) return res.status(404).json({ error: 'Item not found' });
  res.json(item);
});

// Добавление нового товара (для продавцов)
router.post('/add', (req, res) => {
  const { id_prodavca, ka4estvo, price, nazvanie } = req.body;
  const item = {
    id: Date.now(),
    id_prodavca,
    ka4estvo,
    price,
    nazvanie,
    timevblstav: new Date().toISOString()
  };
  db.get('items').push(item).write();
  res.json(item);
});

module.exports = router;