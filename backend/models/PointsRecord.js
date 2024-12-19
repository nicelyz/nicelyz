// backend/models/PointsRecord.js
const mongoose = require('mongoose');

const PointsRecordSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
    operation: { type: String, enum: ['credit', 'debit'], required: true },
    points: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
    // 将status的enum增加'pending'
    status: { type: String, enum: ['pending', 'success', 'failed'], required: true },
    operationId: { type: String, unique: true, required: true }
}, { timestamps: true });

module.exports = mongoose.model('PointsRecord', PointsRecordSchema);
