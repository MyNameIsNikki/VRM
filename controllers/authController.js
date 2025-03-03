// Импортируем библиотеку bcrypt для хеширования паролей
const bcrypt = require('bcrypt');
// Импортируем библиотеку jsonwebtoken для создания JWT токенов
const jwt = require('jsonwebtoken');
// Импортируем объект pool для работы с базой данных
const pool = require('../config/db');

// Экспортируем функцию регистрации нового пользователя
exports.register = async (req, res) => {
    // Извлекаем данные из тела запроса
    const { username, email, password } = req.body;
    try {
        // Хешируем пароль с солью длиной 10
        const hashedPassword = await bcrypt.hash(password, 10);
        // Выполняем SQL-запрос для вставки нового пользователя в таблицу users
        const result = await pool.query(
            // Возвращаем только id, username, email и balance
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, balance',
            [username, email, hashedPassword]
        );
        // Отправляем успешный ответ с данными нового пользователя
        res.status(201).json(result.rows[0]);
    } catch (error) {
        // Обработка ошибок (например, дублирование email)
        res.status(500).json({ error: 'Registration failed' });
    }
};

// Экспортируем функцию логина пользователя
exports.login = async (req, res) => {
    // Извлекаем данные из тела запроса
    const { email, password } = req.body;
    try {
        // Проверяем наличие пользователя по email
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];
        // Если пользователь не найден, возвращаем ошибку 404
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Сравниваем введенный пароль с захешированным
        const validPassword = await bcrypt.compare(password, user.password);
        // Если пароль неверный, возвращаем ошибку 401
        if (!validPassword) return res.status(401).json({ error: 'Invalid password' });

        // Создаем JWT токен с данными пользователя и секретным ключом
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // Отправляем токен и базовую информацию о пользователе
        res.json({ token, user: { id: user.id, username: user.username, balance: user.balance } });
    } catch (error) {
        // Обработка ошибок при выполнении запроса
        res.status(500).json({ error: 'Login failed' });
    }
};