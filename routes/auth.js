// Импортируем библиотеку Express для создания маршрутов
const express = require('express');
// Создаем объект маршрутизатора
const router = express.Router();
// Импортируем функции контроллера для регистрации и логина
const { register, login } = require('../controllers/authController');

// Определяем маршрут для регистрации нового пользователя (POST /api/auth/register)
router.post('/register', register);
// Определяем маршрут для логина пользователя (POST /api/auth/login)
router.post('/login', login);

// Экспортируем маршруты для использования в server.js
module.exports = router;