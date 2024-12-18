 backendmodelsPointsRecord.js
const mongoose = require('mongoose');

const PointsRecordSchema = new mongoose.Schema({
    userId { type mongoose.Schema.Types.ObjectId, ref 'User', required true },
    deviceId { type mongoose.Schema.Types.ObjectId, ref 'Device', required true },
    operation { type String, enum ['credit', 'debit'], required true },  上分credit，下分debit
    points { type Number, required true },
    timestamp { type Date, default Date.now },
    status { type String, enum ['success', 'failed'], required true },
    operationId { type String, unique true, required true }
}, { timestamps true });

module.exports = mongoose.model('PointsRecord', PointsRecordSchema);
