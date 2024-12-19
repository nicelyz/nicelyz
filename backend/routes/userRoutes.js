// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, getUserInfo } = require('../controllers/userController');

// 注册
router.post('/register', register);
// 登录
router.post('/login', login);
// 获取用户信息
router.get('/userinfo', getUserInfo);

module.exports = router;
