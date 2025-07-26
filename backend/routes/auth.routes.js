const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Публичные роуты
router.post('/register', authController.register);  // POST /api/auth/register - регистрация
router.post('/login', authController.login);        // POST /api/auth/login - вход

// Защищенные роуты
router.get('/profile', authMiddleware, authController.getProfile);       // GET /api/auth/profile - получить профиль
router.put('/profile', authMiddleware, authController.updateProfile);    // PUT /api/auth/profile - обновить профиль

module.exports = router;