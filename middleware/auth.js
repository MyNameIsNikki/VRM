// Импортируем библиотеку jsonwebtoken для работы с JWT токенами
const jwt = require('jsonwebtoken');

// Middleware для проверки аутентификации пользователя
const authenticateToken = (req, res, next) => {
    // Извлекаем заголовок авторизации из запроса
    const authHeader = req.headers['authorization'];
    // Извлекаем токен, если заголовок существует (формат: "Bearer token")
    const token = authHeader && authHeader.split(' ')[1];
    // Если токена нет, возвращаем ошибку 401 (Unauthorized)
    if (!token) return res.status(401).json({ error: 'No token provided' });

    // Проверяем валидность токена с использованием секретного ключа из .env
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        // Если токен недействителен, возвращаем ошибку 403 (Forbidden)
        if (err) return res.status(403).json({ error: 'Invalid token' });
        // Если токен валиден, добавляем данные пользователя в запрос и продолжаем
        req.user = user;
        next();
    });
};

// Экспортируем middleware для использования в других модулях
module.exports = authenticateToken;