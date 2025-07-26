const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = async (req, res, next) => {
  try {
    // Получаем токен из заголовка Authorization
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Нет токена авторизации' });
    }

    // Проверяем токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Находим пользователя
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Пользователь не найден' });
    }

    // Добавляем пользователя в req
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Недействительный токен' });
  }
};

module.exports = authMiddleware;