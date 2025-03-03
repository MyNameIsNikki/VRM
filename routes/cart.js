// Импортируем библиотеку Express для создания маршрутов
const express = require('express');
// Создаем объект маршрутизатора
const router = express.Router();
// Импортируем функции контроллера для работы с корзиной
const { addToCart, getCartByUser, removeFromCart } = require('../controllers/cartController');

// Определяем маршрут для добавления товара в корзину (POST /api/cart/add)
router.post('/add', addToCart);
// Определяем маршрут для получения корзины пользователя (GET /api/cart/user/:user_id)
router.get('/user/:user_id', getCartByUser);
// Определяем маршрут для удаления товара из корзины (DELETE /api/cart/remove/:id)
router.delete('/remove/:id', removeFromCart);

// Экспортируем маршруты для использования в server.js
module.exports = router;