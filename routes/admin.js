// Импортируем библиотеку Express для создания маршрутов
const express = require('express');
// Создаем объект маршрутизатора
const router = express.Router();
// Импортируем функции контроллера для админских операций
const { getAllItems, addItem, updateItem, deleteItem } = require('../controllers/adminController');

// Определяем маршрут для получения всех товаров (GET /api/admin/items)
router.get('/items', getAllItems);
// Определяем маршрут для добавления нового товара (POST /api/admin/items)
router.post('/items', addItem);
// Определяем маршрут для обновления товара (PUT /api/admin/items/:id)
router.put('/items/:id', updateItem);
// Определяем маршрут для удаления товара (DELETE /api/admin/items/:id)
router.delete('/items/:id', deleteItem);

// Экспортируем маршруты для использования в server.js
module.exports = router;