// Импортируем библиотеку Express для создания маршрутов
const express = require('express');
// Создаем объект маршрутизатора
const router = express.Router();
// Импортируем функции контроллера для работы с товарами
const { getAllItems, getItemById } = require('../controllers/itemController');

// Определяем маршрут для получения всех товаров (GET /api/items)
router.get('/', getAllItems);
// Определяем маршрут для получения товара по ID (GET /api/items/:id)
router.get('/:id', getItemById);

// Экспортируем маршруты для использования в server.js
module.exports = router;