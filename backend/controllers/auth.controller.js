const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Генерация JWT токена
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Токен действует 30 дней
  });
};

// Регистрация пользователя
exports.register = async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;

    // Проверяем, существует ли пользователь
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'Пользователь с таким email или именем уже существует'
      });
    }

    // Создаем нового пользователя
    const user = new User({
      username,
      email,
      password,
      phone
    });

    await user.save();

    // Генерируем токен
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Пользователь успешно зарегистрирован',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    res.status(400).json({
      message: 'Ошибка при регистрации',
      error: error.message
    });
  }
};

// Вход пользователя
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Находим пользователя и включаем пароль в результат
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        message: 'Неверный email или пароль'
      });
    }

    // Проверяем пароль
    const isPasswordCorrect = await user.correctPassword(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: 'Неверный email или пароль'
      });
    }

    // Генерируем токен
    const token = generateToken(user._id);

    res.json({
      message: 'Успешный вход',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Ошибка при входе',
      error: error.message
    });
  }
};

// Получение профиля текущего пользователя
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Ошибка при получении профиля',
      error: error.message
    });
  }
};

// Обновление профиля
exports.updateProfile = async (req, res) => {
  try {
    const { username, phone } = req.body;
    const user = await User.findById(req.user.id);

    if (username) user.username = username;
    if (phone) user.phone = phone;

    await user.save();

    res.json({
      message: 'Профиль успешно обновлен',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(400).json({
      message: 'Ошибка при обновлении профиля',
      error: error.message
    });
  }
};