// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// 用户注册
router.post('/register', userController.register);

// 用户登录
router.post('/login', userController.login);

// 获取用户信息（需要认证）
router.get('/userinfo', authMiddleware, userController.getUserInfo);

// 用户登出（如果需要）
router.post('/logout', userController.logout);

module.exports = router;
