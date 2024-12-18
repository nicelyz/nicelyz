// backend/models/Device.js
const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    zone: { type: String, required: true },
    ipAddress: { type: String, unique: true, required: true },
    probability: { type: Number, default: 100 }, // 可根据需求设定默认值或范围
    status: { type: String, enum: ['idle', 'occupied', 'fault'], default: 'idle' },
    countdown: { type: Number, default: 0 }, // 留机倒计时（秒）
    videoStreamURL: { type: String, default: '' },
    currentHolder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });

module.exports = mongoose.model('Device', DeviceSchema);
