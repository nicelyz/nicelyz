// backend/controllers/playerController.js
const User = require('../models/User');
const Device = require('../models/Device');
const PointsRecord = require('../models/PointsRecord');
const OperationLog = require('../models/OperationLog'); // 用于记录设备相关操作日志

let io;
const pendingOperations = {};

module.exports.setIO = (socketIO) => {
    io = socketIO;

    // 监听设备反馈事件
    io.on('connection', (socket) => {
        console.log('Device or client connected:', socket.id);

        socket.on('feedback', (data) => {
            // data应包含 { operationId: 'xxx', feedback: '...' }
            handleFeedback(data.operationId, data.feedback);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });
};

function handleFeedback(operationId, feedback) {
    const op = pendingOperations[operationId];
    if (!op) return; // 无此操作，可能定时器已触发处理过

    clearTimeout(op.timeout);

    // 根据op.category判断是上分操作还是设备操作
    if (op.category === 'credit') {
        // 对上分反馈进行判断：成功反馈以sf开头且非sffail
        if (feedback && feedback.startsWith('sf') && feedback !== 'sffail') {
            finalizeCreditOperation(operationId, 'success');
        } else {
            finalizeCreditOperation(operationId, 'failed');
        }
    } else if (op.category === 'deviceOperation') {
        // 设备操作的成功反馈为xxxok（hzok、hbok、ksok、jsok）
        // 失败或无响应则failed
        if (feedback && feedback.endsWith('ok')) {
            finalizeDeviceOperation(operationId, 'success');
        } else {
            finalizeDeviceOperation(operationId, 'failed');
        }
    }
}

// 上分操作finalize
async function finalizeCreditOperation(operationId, status) {
    const op = pendingOperations[operationId];
    if (!op) return;

    const { userId, deviceId, points, recordId } = op;
    delete pendingOperations[operationId];

    const user = await User.findById(userId);
    const device = await Device.findById(deviceId);
    const record = await PointsRecord.findById(recordId);

    if (!record || !user) {
        return;
    }

    if (status === 'success') {
        record.status = 'success';
        await record.save();
        // 不需返还积分或修改设备状态，因为上分成功时设备已占用
    } else {
        // failed或超时失败
        user.currentPoints += points;
        user.exceptionStatus = true;
        await user.save();

        record.status = 'failed';
        await record.save();

        if (device) {
            device.status = 'idle';
            device.currentHolder = null;
            await device.save();
        } else {
            console.warn(`Device ${deviceId} not found. Can't reset device status.`);
        }
    }
}

// 设备操作finalize
async function finalizeDeviceOperation(operationId, status) {
    const op = pendingOperations[operationId];
    if (!op) return;

    const { userId, deviceId, recordId } = op;
    delete pendingOperations[operationId];

    const user = await User.findById(userId);
    const device = await Device.findById(deviceId);
    const record = await OperationLog.findById(recordId);

    if (!record || !user) {
        return;
    }

    record.status = status;
    await record.save();
    // 这些设备操作暂不需返还积分或标记异常状态，也不强制修改设备状态
}

// 上分API
exports.credit = async (req, res) => {
    const { deviceId, points } = req.body;
    const userId = req.headers.userid;

    if (!userId || !deviceId || !points) {
        return res.status(400).json({ message: '缺少必要参数' });
    }

    if (points <= 0 || points > 2000) {
        return res.status(400).json({ message: '上分积分必须为1到2000之间' });
    }

    const user = await User.findById(userId);
    if (!user) {
        return res.status(400).json({ message: '用户不存在' });
    }

    if (user.currentPoints < points) {
        return res.status(400).json({ message: '当前积分不足' });
    }

    if (user.exceptionStatus) {
        return res.status(400).json({ message: '上分操作异常，请联系管理员' });
    }

    const device = await Device.findById(deviceId);
    if (!device || device.status !== 'idle') {
        return res.status(400).json({ message: '设备不可用或已被占用' });
    }

    if (user.occupiedDevices >= 2) {
        return res.status(400).json({ message: '已达到设备占用上限' });
    }

    // 更新玩家积分与设备状态
    user.currentPoints -= points;
    user.occupiedDevices += 1;
    await user.save();

    device.status = 'occupied';
    device.currentHolder = user._id;
    await device.save();

    const operationId = 'op_' + Date.now();
    const record = await PointsRecord.create({
        userId: user._id,
        deviceId: device._id,
        operation: 'credit',
        points,
        status: 'pending',
        operationId
    });

    const command = `###sf${points}e`;
    io.emit('command', { operationId, command });

    const timeout = setTimeout(() => {
        finalizeCreditOperation(operationId, 'failed');
    }, 30000);

    pendingOperations[operationId] = {
        category: 'credit',
        userId: user._id.toString(),
        deviceId: device._id.toString(),
        points,
        recordId: record._id.toString(),
        timeout
    };

    return res.status(200).json({ message: '上分指令已发送', operationId });
};

// 下分API(无异步反馈)
exports.debit = async (req, res) => {
    const { deviceId } = req.body;
    const userId = req.headers.userid;

    if (!userId || !deviceId) {
        return res.status(400).json({ message: '缺少必要参数' });
    }

    const user = await User.findById(userId);
    if (!user) {
        return res.status(400).json({ message: '用户不存在' });
    }

    const device = await Device.findById(deviceId);
    if (!device || device.status !== 'occupied' || (device.currentHolder && device.currentHolder.toString() !== userId)) {
        return res.status(400).json({ message: '设备不可用或未被该玩家占用' });
    }

    const command = `###tf`;
    io.emit('command', { operationId: 'op_'+Date.now(), command });

    const points = 1000;
    user.currentPoints += points;
    user.occupiedDevices -= 1;
    await user.save();

    device.status = 'idle';
    device.currentHolder = null;
    await device.save();

    const operationId = 'op_' + Date.now();
    const record = new PointsRecord({
        userId: user._id,
        deviceId: device._id,
        operation: 'debit',
        points,
        status: 'success',
        operationId
    });
    await record.save();

    return res.status(200).json({ message: '下分操作完成', operationId });
};

// 通用设备操作初始化函数
async function initiateDeviceOperation(req, res, operationType, commandPrefix) {
    const { deviceId } = req.body;
    const userId = req.headers.userid;

    if (!userId || !deviceId) {
        return res.status(400).json({ message: '缺少必要参数' });
    }

    const user = await User.findById(userId);
    if (!user) {
        return res.status(400).json({ message: '用户不存在' });
    }

    const device = await Device.findById(deviceId);
    if (!device) {
        return res.status(400).json({ message: '设备不存在' });
    }

    // 这里可根据操作类型和设备状态做额外检查，如设备非故障才能执行

    const operationId = 'op_' + Date.now();
    const command = `###${commandPrefix}`;

    const record = await OperationLog.create({
        operatorId: user._id,
        role: user.role,
        operationType,
        status: 'pending',
        operationId
    });

    io.emit('command', { operationId, command });

    const timeout = setTimeout(() => {
        finalizeDeviceOperation(operationId, 'failed');
    }, 30000);

    pendingOperations[operationId] = {
        category: 'deviceOperation',
        userId: user._id.toString(),
        deviceId: device._id.toString(),
        recordId: record._id.toString(),
        timeout
    };

    return res.status(200).json({ message: `${operationType}指令已发送`, operationId });
}

exports.changeRotation = (req, res) => {
    return initiateDeviceOperation(req, res, 'change_rotation', 'hz');
};

exports.changeCurrency = (req, res) => {
    return initiateDeviceOperation(req, res, 'change_currency', 'hb');
};

exports.startStop = (req, res) => {
    return initiateDeviceOperation(req, res, 'start_stop', 'ks');
};

exports.settlement = (req, res) => {
    return initiateDeviceOperation(req, res, 'settlement', 'js');
}
