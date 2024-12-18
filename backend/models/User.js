// backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['player', 'admin'], default: 'player' },
    currentPoints: { type: Number, default: 0 },
    exceptionStatus: { type: Boolean, default: false }, // 上分异常状态
    occupiedDevices: { type: Number, default: 0 }, // 已占用设备数量
    status: { type: String, enum: ['active', 'banned'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
