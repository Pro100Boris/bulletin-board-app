// Импорт необходимых модулей
const mongoose = require('mongoose');  // Подключаем Mongoose для работы с MongoDB
const bcrypt = require('bcryptjs');    // Для хеширования паролей

// Создаем схему пользователя
const userSchema = new mongoose.Schema({
  // Имя пользователя
  username: {
    type: String,        // Тип данных - строка
    required: [true, 'Пожалуйста, укажите имя пользователя'],  // Обязательное поле
    unique: true,        // Должно быть уникальным
    trim: true,          // Удаляем лишние пробелы
    minlength: 3,        // Минимальная длина
    maxlength: 30        // Максимальная длина
  },
  
  // Электронная почта
  email: {
    type: String,
    required: [true, 'Пожалуйста, укажите email'],
    unique: true,
    trim: true,
    lowercase: true,     // Сохраняем в нижнем регистре
    match: [             // Проверка формата email
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Пожалуйста, введите корректный email'
    ]
  },
  
  // Пароль
  password: {
    type: String,
    required: [true, 'Пожалуйста, укажите пароль'],
    minlength: 8,        // Минимальная длина пароля
    select: false        // Не возвращаем пароль в запросах
  },
  
  // Телефон (необязательное поле)
  phone: {
    type: String,
    trim: true
  },
  
  // Аватар (путь к изображению)
  avatar: {
    type: String,
    default: 'default.jpg'  // Значение по умолчанию
  }
}, {
  timestamps: true  // Автоматически добавляет поля createdAt и updatedAt
});

// Хеширование пароля перед сохранением
userSchema.pre('save', async function(next) {
  // Хешируем только если пароль был изменен
  if (!this.isModified('password')) return next();
  
  // Генерируем соль и хешируем пароль
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Метод для проверки пароля
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Экспортируем модель
module.exports = mongoose.model('User', userSchema);