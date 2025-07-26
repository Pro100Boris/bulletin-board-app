const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Импортируем модели
const User = require('../models/user');
const Ad = require('../models/ad');

const seedData = async () => {
  try {
    // Подключаемся к базе данных
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Подключено к MongoDB');

    // Очищаем существующие данные
    await User.deleteMany({});
    await Ad.deleteMany({});
    console.log('✓ Очищены существующие данные');

    // Создаем тестовых пользователей
    const users = [
      {
        username: 'testuser1',
        email: 'test1@example.com',
        password: await bcrypt.hash('password123', 12),
        phone: '+7 (999) 123-45-67'
      },
      {
        username: 'testuser2',
        email: 'test2@example.com',
        password: await bcrypt.hash('password123', 12),
        phone: '+7 (999) 234-56-78'
      },
      {
        username: 'ivan_petrov',
        email: 'ivan@example.com',
        password: await bcrypt.hash('password123', 12),
        phone: '+7 (999) 345-67-89'
      }
    ];

    const createdUsers = await User.insertMany(users);
    console.log('✓ Созданы тестовые пользователи');

    // Создаем тестовые объявления
    const ads = [
      {
        title: 'iPhone 14 Pro в отличном состоянии',
        description: 'Продаю iPhone 14 Pro 128GB в отличном состоянии. Использовался аккуратно, всегда был в чехле и с защитным стеклом. В комплекте оригинальная коробка, зарядное устройство и документы.',
        price: 85000,
        category: 'Электроника',
        location: 'Москва, Центральный округ',
        user: createdUsers[0]._id,
        status: 'active',
        images: []
      },
      {
        title: 'Продам автомобиль Toyota Camry 2019',
        description: 'Продается Toyota Camry 2019 года выпуска. Пробег 45 000 км. Один владелец, обслуживался только у официального дилера. Полная комплектация, кожаный салон, автомат.',
        price: 2200000,
        category: 'Транспорт',
        location: 'Санкт-Петербург',
        user: createdUsers[1]._id,
        status: 'active',
        images: []
      },
      {
        title: '2-комнатная квартира в центре',
        description: 'Сдается уютная 2-комнатная квартира в центре города. Квартира полностью меблирована, есть вся необходимая техника. Рядом метро, парки, магазины.',
        price: 50000,
        category: 'Недвижимость',
        location: 'Москва, ЦАО',
        user: createdUsers[2]._id,
        status: 'active',
        images: []
      },
      {
        title: 'MacBook Pro 16" M1 Pro',
        description: 'Продаю MacBook Pro 16" с чипом M1 Pro. Память 32GB, SSD 1TB. Состояние идеальное, покупался для работы, использовался дома. Есть все документы и оригинальная упаковка.',
        price: 180000,
        category: 'Электроника',
        location: 'Екатеринбург',
        user: createdUsers[0]._id,
        status: 'active',
        images: []
      },
      {
        title: 'Велосипед Trek горный',
        description: 'Продаю горный велосипед Trek в хорошем состоянии. Подходит для поездок по городу и легкого бездорожья. Недавно проводилось ТО.',
        price: 35000,
        category: 'Хобби',
        location: 'Новосибирск',
        user: createdUsers[1]._id,
        status: 'active',
        images: []
      },
      {
        title: 'Диван кожаный 3-местный',
        description: 'Продается кожаный диван в отличном состоянии. Очень удобный, качественная кожа, каркас из массива дерева. Размеры: 220x90x85 см.',
        price: 45000,
        category: 'Для дома',
        location: 'Казань',
        user: createdUsers[2]._id,
        status: 'active',
        images: []
      },
      {
        title: 'Услуги репетитора по математике',
        description: 'Опытный преподаватель математики предлагает услуги репетиторства. Подготовка к ЕГЭ, ОГЭ, помощь студентам. Индивидуальный подход к каждому ученику.',
        price: 2000,
        category: 'Услуги',
        location: 'Москва',
        user: createdUsers[0]._id,
        status: 'active',
        images: []
      },
      {
        title: 'Щенки лабрадора',
        description: 'Продаются щенки лабрадора от породистых родителей. Возраст 2 месяца, привиты, с документами. Очень умные и дружелюбные малыши.',
        price: 25000,
        category: 'Животные',
        location: 'Сочи',
        user: createdUsers[1]._id,
        status: 'active',
        images: []
      },
      {
        title: 'Зимняя куртка North Face',
        description: 'Продается зимняя куртка The North Face, размер L. Состояние отличное, очень теплая, подходит для суровых зим. Оригинал, есть бирки.',
        price: 15000,
        category: 'Мода',
        location: 'Челябинск',
        user: createdUsers[2]._id,
        status: 'active',
        images: []
      },
      {
        title: 'Работа программистом удаленно',
        description: 'IT-компания ищет Frontend разработчика для работы над интересными проектами. Опыт работы с React от 2 лет. Полная занятость, удаленная работа.',
        price: 150000,
        category: 'Работа',
        location: 'Удаленно',
        user: createdUsers[0]._id,
        status: 'active',
        images: []
      }
    ];

    const createdAds = await Ad.insertMany(ads);
    console.log(`✓ Создано ${createdAds.length} тестовых объявлений`);

    console.log('\n🎉 Тестовые данные успешно загружены!');
    console.log('\nТестовые пользователи:');
    console.log('Email: test1@example.com, Пароль: password123');
    console.log('Email: test2@example.com, Пароль: password123');
    console.log('Email: ivan@example.com, Пароль: password123');

  } catch (error) {
    console.error('❌ Ошибка при загрузке тестовых данных:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✓ Отключено от MongoDB');
    process.exit(0);
  }
};

// Запускаем скрипт, если файл выполняется напрямую
if (require.main === module) {
  seedData();
}

module.exports = seedData;