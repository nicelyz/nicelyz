// backend/models/Settings.js
const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    // 定义您的系统设置字段
    siteName: { type: String, default: 'Arcade Management System' },
    // 其他设置项...
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
