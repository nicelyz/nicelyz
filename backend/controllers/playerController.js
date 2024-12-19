// backend/controllers/playerController.js
const User = require('../models/User');
const Device = require('../models/Device');
const PointsRecord = require('../models/PointsRecord');

let io;
const pendingOperations = {};

module.exports.setIO = (socketIO) => {
    io = socketIO;

    // 监听设备反馈事件
    io.on('connection', (socket) => {
        console.log('Device or client connected:', socket.id);

        socket.on('feedback', (data) => {
            // data应包含 { operationId: 'xxx', feedback: 'sf1000' 或 'sffail' }
            handleFeedback(data.operationId, data.feedback);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });
};

function handleFeedback(operationId, feedback) {
    const op = pendingOperations[operationId];
    if (!op) return; // 无此操作，可能定时器超时已清除

    clearTimeout(op.timeout);

    // 判断反馈是成功还是失败
    // 假设成功反馈形如 'sf1000'，失败 'sffail' or 不符合预期
    if (feedback && feedback.startsWith('sf') && feedback !== 'sffail') {
        // 成功反馈
        finalizeCreditOperation(operationId, 'success');
    } else {
        // 失败反馈
        finalizeCreditOperation(operationId, 'failed');
    }
}

async function finalizeCreditOperation(operationId, status) {
    const op = pendingOperations[operationId];
    if (!op) return;

    const { userId, deviceId, points, recordId } = op;
    delete pendingOperations[operationId]; // 无论成功失败都先删除pending操作

    const user = await User.findById(userId);
    const device = await Device.findById(deviceId);
    const record = await PointsRecord.findById(recordId);

    if (!record || !user) {
        // 如果关键数据缺失则无法正常更新，但至少不会报错
        return;
    }

    if (status === 'success') {
        // 上分成功已在初始时扣分和占用设备，不需返还积分
        record.status = 'success';
        await record.save();
        // 设备和用户已在credit时更新，这里无需变动
    } else {
        // 上分失败或超时，返还积分，标记用户异常
        user.currentPoints += points;
        user.exceptionStatus = true;
        await user.save();

        // 记录失败状态
        record.status = 'failed';
        await record.save();

        // 仅在device存在的情况下恢复设备状态
        if (device) {
            device.status = 'idle';
            device.currentHolder = null;
            await device.save();
        } else {
            console.warn(`Device ${deviceId} not found. Can't reset device status.`);
        }
    }
}

exports.credit = async (req, res) => {
    const { deviceId, points } = req.body;
    const userId = req.headers.userid; // 测试阶段: 模拟玩家身份

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

    // 积分验证
    if (user.currentPoints < points) {
        return res.status(400).json({ message: '当前积分不足' });
    }

    // 上分异常状态验证
    if (user.exceptionStatus) {
        return res.status(400).json({ message: '上分操作异常，请联系管理员' });
    }

    const device = await Device.findById(deviceId);
    if (!device || device.status !== 'idle') {
        return res.status(400).json({ message: '设备不可用或已被占用' });
    }

    // 检查设备占用上限
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

    // 生成operationId
    const operationId = 'op_' + Date.now();

    // 创建积分记录，初始为pending状态，需要在PointsRecord.js中enum加入'pending'
    const record = await PointsRecord.create({
        userId: user._id,
        deviceId: device._id,
        operation: 'credit',
        points,
        status: 'pending',
        operationId
    });

    // 发送上分指令给设备, 包含operationId
    const command = `###sf${points}e`;
    io.emit('command', { operationId, command });

    // 设置定时器（测试用30秒）
    const timeout = setTimeout(() => {
        // 超时处理
        finalizeCreditOperation(operationId, 'failed');
    }, 30000);

    // 存储操作上下文
    pendingOperations[operationId] = {
        userId: user._id.toString(),
        deviceId: device._id.toString(),
        points,
        recordId: record._id.toString(),
        timeout
    };

    return res.status(200).json({ message: '上分指令已发送', operationId });
};

exports.debit = async (req, res) => {
    const { deviceId } = req.body;
    const userId = req.headers.userid; // 测试用

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

    // 下分指令仍无异步反馈，后续可完善
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
