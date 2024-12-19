// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// 使用认证中间件验证用户身份
router.use(authMiddleware);
// 使用管理员中间件验证用户角色
router.use(adminMiddleware);

// 用户管理路由
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// 设备管理路由
router.get('/devices', adminController.getAllDevices);
router.post('/devices', adminController.createDevice);
router.get('/devices/:id', adminController.getDeviceById);
router.put('/devices/:id', adminController.updateDevice);
router.delete('/devices/:id', adminController.deleteDevice);
router.post('/devices/:id/control', adminController.controlDevice);

// 数据统计路由
router.get('/statistics/users', adminController.getUserStatistics);
router.get('/statistics/devices', adminController.getDeviceStatistics);

// 系统设置路由
router.get('/settings', adminController.getSettings);
router.put('/settings', adminController.updateSettings);

module.exports = router;
