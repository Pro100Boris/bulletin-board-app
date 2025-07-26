const Ad = require('../models/ad');
const User = require('../models/user');

// Получение всех объявлений с фильтрацией и пагинацией
exports.getAllAds = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Фильтры
    const filters = {};
    if (req.query.category) filters.category = req.query.category;
    if (req.query.minPrice) filters.price = { $gte: req.query.minPrice };
    if (req.query.maxPrice) {
      if (filters.price) {
        filters.price.$lte = req.query.maxPrice;
      } else {
        filters.price = { $lte: req.query.maxPrice };
      }
    }
    if (req.query.location) {
      filters.location = { $regex: req.query.location, $options: 'i' };
    }
    if (req.query.search) {
      filters.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Сортировка
    let sort = {};
    switch (req.query.sort) {
      case 'price_asc':
        sort = { price: 1 };
        break;
      case 'price_desc':
        sort = { price: -1 };
        break;
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'oldest':
        sort = { createdAt: 1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    const ads = await Ad.find(filters)
      .populate('user', 'username phone')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Ad.countDocuments(filters);

    res.json({
      ads,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении объявлений', error: error.message });
  }
};

// Получение объявления по ID
exports.getAdById = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id).populate('user', 'username phone email');
    
    if (!ad) {
      return res.status(404).json({ message: 'Объявление не найдено' });
    }

    res.json(ad);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении объявления', error: error.message });
  }
};

// Создание нового объявления
exports.createAd = async (req, res) => {
  try {
    const { title, description, price, category, location } = req.body;
    
    // Получаем пути к загруженным изображениям
    const images = req.files ? req.files.map(file => file.path) : [];

    const newAd = new Ad({
      title,
      description,
      price,
      category,
      location,
      images,
      user: req.user.id // Получаем из middleware аутентификации
    });

    const savedAd = await newAd.save();
    const populatedAd = await Ad.findById(savedAd._id).populate('user', 'username phone');

    res.status(201).json(populatedAd);
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при создании объявления', error: error.message });
  }
};

// Обновление объявления
exports.updateAd = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    
    if (!ad) {
      return res.status(404).json({ message: 'Объявление не найдено' });
    }

    // Проверяем, что пользователь является владельцем объявления
    if (ad.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Нет прав для редактирования этого объявления' });
    }

    const { title, description, price, category, location, status } = req.body;
    
    // Обновляем поля
    if (title) ad.title = title;
    if (description) ad.description = description;
    if (price) ad.price = price;
    if (category) ad.category = category;
    if (location) ad.location = location;
    if (status) ad.status = status;

    // Если есть новые изображения, добавляем их
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.path);
      ad.images = [...ad.images, ...newImages];
    }

    const updatedAd = await ad.save();
    const populatedAd = await Ad.findById(updatedAd._id).populate('user', 'username phone');

    res.json(populatedAd);
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при обновлении объявления', error: error.message });
  }
};

// Удаление объявления
exports.deleteAd = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    
    if (!ad) {
      return res.status(404).json({ message: 'Объявление не найдено' });
    }

    // Проверяем, что пользователь является владельцем объявления
    if (ad.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Нет прав для удаления этого объявления' });
    }

    await Ad.findByIdAndDelete(req.params.id);
    res.json({ message: 'Объявление успешно удалено' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении объявления', error: error.message });
  }
};

// Получение объявлений пользователя
exports.getUserAds = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const ads = await Ad.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Ad.countDocuments({ user: req.user.id });

    res.json({
      ads,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении объявлений пользователя', error: error.message });
  }
};

// Получение категорий
exports.getCategories = async (req, res) => {
  try {
    const categories = [
      'Недвижимость',
      'Транспорт',
      'Работа',
      'Услуги',
      'Электроника',
      'Для дома',
      'Хобби',
      'Животные',
      'Мода'
    ];
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении категорий', error: error.message });
  }
};