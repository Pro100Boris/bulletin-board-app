const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const adsController = require('../controllers/ads.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Настройка multer для загрузки изображений
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB максимум
  },
  fileFilter: function (req, file, cb) {
    // Проверяем тип файла
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Можно загружать только изображения'), false);
    }
  }
});

// Публичные роуты (не требуют авторизации)
router.get('/', adsController.getAllAds);                    // GET /api/ads - получить все объявления
router.get('/categories', adsController.getCategories);      // GET /api/ads/categories - получить категории
router.get('/:id', adsController.getAdById);                // GET /api/ads/:id - получить объявление по ID

// Защищенные роуты (требуют авторизации)
router.post('/', authMiddleware, upload.array('images', 10), adsController.createAd);           // POST /api/ads - создать объявление
router.put('/:id', authMiddleware, upload.array('images', 10), adsController.updateAd);        // PUT /api/ads/:id - обновить объявление
router.delete('/:id', authMiddleware, adsController.deleteAd);                                  // DELETE /api/ads/:id - удалить объявление
router.get('/user/my', authMiddleware, adsController.getUserAds);                               // GET /api/ads/user/my - получить объявления пользователя

module.exports = router;