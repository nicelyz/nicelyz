// backend/controllers/playerController.js
const User = require('../models/User');
const Device = require('../models/Device');
const PointsRecord = require('../models/PointsRecord');
// 假设io实例从全局导入或从一个单例中获取
// 暂时简化处理：在index.js中导出io以便在此使用。

let io; 
module.exports.setIO = (socketIO) => {
    io = socketIO;
};

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

    // 查找设备
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

    // 创建积分记录
    const record = new PointsRecord({
        userId: user._id,
        deviceId: device._id,
        operation: 'credit',
        points,
        status: 'success', // 暂定为成功，后续完善反馈机制
        operationId
    });
    await record.save();

    // 发送上分指令给设备
    const command = `###sf${points}e`;
    io.emit('command', command); // 实际应发送给特定deviceId对应的socket，需后续完善

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

    // 发送下分指令给设备
    const command = `###tf`;
    io.emit('command', command); // 实际应发送给相应设备的socket

    // 假设直接成功（后续完善反馈）
    const points = 1000; // 模拟从设备获得1000分，后续根据反馈动态确定
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
        status: 'success', // 暂定成功，后续根据反馈完善
        operationId
    });
    await record.save();

    return res.status(200).json({ message: '下分操作完成', operationId });
};
