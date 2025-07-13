require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Проверка загруженных модулей
console.log('\nПроверка модулей:');
console.log('- express:', express ? 'OK' : 'Не загружен');
console.log('- mongoose:', mongoose ? 'OK' : 'Не загружен');
console.log('- cors:', cors ? 'OK' : 'Не загружен');
console.log('- path:', path ? 'OK' : 'Не загружен');
console.log('- dotenv:', process.env.MONGODB_URI ? 'OK' : 'Не загружен');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Подключение к MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('\n✓ Подключено к MongoDB');
    
    // Проверка моделей
    console.log('\nПроверка моделей:');
    try {
      require('./models/User');
      require('./models/Ad');
      console.log('- Модель User:', mongoose.model('User') ? 'OK' : 'Не подключена');
      console.log('- Модель Ad:', mongoose.model('Ad') ? 'OK' : 'Не подключена');
    } catch (err) {
      console.error('Ошибка при проверке моделей:', err.message);
    }
  })
  .catch(err => console.error('✗ Ошибка подключения к MongoDB:', err));

// Тестовый роут
app.get('/', (req, res) => {
  res.send('Backend доски объявлений работает!');
});

// Подключение роутов объявлений
const adsRouter = require('./routes/ads');
app.use('/api/ads', adsRouter);

// Статика для загруженных файлов
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\nСервер запущен на http://localhost:${PORT}`);
});