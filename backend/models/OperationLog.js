// backend/models/OperationLog.js
const mongoose = require('mongoose');

const OperationLogSchema = new mongoose.Schema({
  operatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['admin', 'player'], required: true },
  operationType: { type: String, required: true }, 
  details: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'success', 'failed'], required: true },
  operationId: { type: String, unique: true, required: true }
}, { timestamps: true });

module.exports = mongoose.model('OperationLog', OperationLogSchema);
