// backend/routes/playerRoutes.js
const express = require('express');
const router = express.Router();
const { 
  credit, 
  debit, 
  changeRotation, 
  changeCurrency, 
  startStop, 
  settlement 
} = require('../controllers/playerController');

// 上分
router.post('/credit', credit);

// 下分
router.post('/debit', debit);

// 换转
router.post('/changeRotation', changeRotation);

// 换币
router.post('/changeCurrency', changeCurrency);

// 开停
router.post('/startStop', startStop);

// 精算
router.post('/settlement', settlement);

module.exports = router;
