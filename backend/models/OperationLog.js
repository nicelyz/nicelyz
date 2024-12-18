// backend/models/OperationLog.js
const mongoose = require('mongoose');

const OperationLogSchema = new mongoose.Schema({
    operatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['admin', 'player'], required: true },
    operationType: { type: String, required: true }, 
    // 如 'credit_points', 'debit_points', 'change_rotation', 'change_currency', 'start_stop', 'settlement'
    details: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('OperationLog', OperationLogSchema);
