const express = require('express');
const router = express.Router();
const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('data/db.json');
const db = lowdb(adapter);

// Получение всех продавцов
router.get('/', (req, res) => {
  const sellers = db.get('sellers').value();
  res.json(sellers);
});

// Получение продавца по ID пользователя
router.get('/user/:user_id', (req, res) => {
  const seller = db.get('sellers').find({ id_polz: parseInt(req.params.user_id) }).value();
  if (!seller) return res.status(404).json({ error: 'Seller not found' });
  res.json(seller);
});

module.exports = router;