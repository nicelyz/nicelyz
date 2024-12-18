// backend/routes/playerRoutes.js
const express = require('express');
const router = express.Router();
const { credit, debit } = require('../controllers/playerController');

// 上分
router.post('/credit', credit);

// 下分
router.post('/debit', debit);

module.exports = router;
