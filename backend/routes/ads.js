const express = require('express');
const router = express.Router();
const Ad = require('../models/Ad');

// GET /api/ads - Получение объявлений
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const ads = await Ad.find()
      .limit(limit * 1)
      .skip((page - 1) * limit);
      
    res.json(ads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;