// Импортируем библиотеку Express для создания веб-сервера
const express = require('express');
// Импортируем библиотеку cors для обработки кросс-доменных запросов
const cors = require('cors');
// Импортируем модуль dotenv для работы с переменными окружения из файла .env
require('dotenv').config();
// Импортируем маршруты для аутентификации, товаров, корзины и админ-панели
const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');
const cartRoutes = require('./routes/cart');
const adminRoutes = require('./routes/admin');

// Создаем экземпляр приложения Express
const app = express();
// Устанавливаем порт, либо используем значение из .env, либо 5000 по умолчанию
const port = process.env.PORT || 5000;

// Middleware для парсинга JSON-запросов от клиента
app.use(express.json());
// Middleware для разрешения кросс-доменных запросов (CORS)
app.use(cors());

// Подключаем маршруты для разных endpoint'ов
// /api/auth для обработки регистрации и логина
app.use('/api/auth', authRoutes);
// /api/items для работы с товарами
app.use('/api/items', itemRoutes);
// /api/cart для работы с корзиной (защищено аутентификацией)
app.use('/api/cart', require('./middleware/auth'), cartRoutes);
// /api/admin для админских функций (защищено аутентификацией)
app.use('/api/admin', require('./middleware/auth'), adminRoutes);

// Запускаем сервер на указанном порту и выводим сообщение при успешном старте
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});