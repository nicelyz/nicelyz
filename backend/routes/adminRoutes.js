// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { createDevice, getDevices, getDeviceById, updateDevice, deleteDevice } = require('../controllers/adminController');

// 创建设备
router.post('/devices', createDevice);

// 获取设备列表
router.get('/devices', getDevices);

// 获取单个设备详情
router.get('/devices/:id', getDeviceById);

// 更新设备信息
router.put('/devices/:id', updateDevice);

// 删除设备
router.delete('/devices/:id', deleteDevice);

module.exports = router;
