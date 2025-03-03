// Импортируем класс Pool из библиотеки pg для управления подключениями к PostgreSQL
const { Pool } = require('pg');
// Импортируем модуль dotenv для загрузки переменных окружения
require('dotenv').config();

// Создаем объект Pool для подключения к базе данных с параметрами из .env
const pool = new Pool({
    // Имя пользователя базы данных
    user: process.env.DB_USER,
    // Хост базы данных (по умолчанию localhost)
    host: process.env.DB_HOST,
    // Название базы данных
    database: process.env.DB_NAME,
    // Пароль для подключения к базе данных
    password: process.env.DB_PASSWORD,
    // Порт базы данных (по умолчанию 5432 для PostgreSQL)
    port: process.env.DB_PORT,
});

// Экспортируем объект pool для использования в других модулях
module.exports = pool;