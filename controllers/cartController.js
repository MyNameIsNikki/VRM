// Импортируем объект pool для работы с базой данных
const pool = require('../config/db');

// Экспортируем функцию добавления товара в корзину
exports.addToCart = async (req, res) => {
    // Извлекаем user_id и item_id из тела запроса
    const { user_id, item_id } = req.body;
    try {
        // Выполняем SQL-запрос для вставки записи в таблицу cart
        const result = await pool.query(
            'INSERT INTO cart (user_id, item_id) VALUES ($1, $2) RETURNING *',
            [user_id, item_id]
        );
        // Отправляем добавленную запись
        res.json(result.rows[0]);
    } catch (error) {
        // Обработка ошибок (например, дублирование или неверные ID)
        res.status(500).json({ error: 'Failed to add to cart' });
    }
};

// Экспортируем функцию получения корзины пользователя
exports.getCartByUser = async (req, res) => {
    try {
        // Выполняем SQL-запрос для выборки корзины с данными товаров
        const result = await pool.query(
            'SELECT c.*, i.name, i.price, i.discount, i.image_url FROM cart c JOIN items i ON c.item_id = i.id WHERE c.user_id = $1',
            [req.params.user_id]
        );
        // Отправляем данные корзины
        res.json(result.rows);
    } catch (error) {
        // Обработка ошибок при выполнении запроса
        res.status(500).json({ error: 'Failed to fetch cart' });
    }
};

// Экспортируем функцию удаления товара из корзины
exports.removeFromCart = async (req, res) => {
    try {
        // Выполняем SQL-запрос для удаления записи из таблицы cart по ID
        await pool.query('DELETE FROM cart WHERE id = $1', [req.params.id]);
        // Отправляем сообщение об успехе
        res.json({ message: 'Item removed from cart' });
    } catch (error) {
        // Обработка ошибок при выполнении запроса
        res.status(500).json({ error: 'Failed to remove item from cart' });
    }
};