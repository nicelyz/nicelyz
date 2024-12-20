// backend/controllers/adminController.js
const User = require('../models/User');
const Device = require('../models/Device');
const Settings = require('../models/Settings'); // 确保 Settings 模型存在

// 获取所有用户
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password'); // 排除密码字段
        res.status(200).json(users);
    } catch (error) {
        console.error('获取用户列表失败:', error);
        res.status(500).json({ message: '获取用户列表失败', error: error.message });
    }
};

// 获取单个用户信息
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id, '-password');
        if (!user) return res.status(404).json({ message: '用户不存在' });
        res.status(200).json(user);
    } catch (error) {
        console.error('获取用户信息失败:', error);
        res.status(500).json({ message: '获取用户信息失败', error: error.message });
    }
};

// 更新用户信息
exports.updateUser = async (req, res) => {
    const { role, status, currentPoints } = req.body;
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: '用户不存在' });
        
        if (role) user.role = role;
        if (status) user.status = status;
        if (currentPoints !== undefined) user.currentPoints = currentPoints;

        await user.save();
        res.status(200).json({ message: '用户信息更新成功', user });
    } catch (error) {
        console.error('更新用户信息失败:', error);
        res.status(500).json({ message: '更新用户信息失败', error: error.message });
    }
};

// 删除用户
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: '用户不存在' });
        res.status(200).json({ message: '用户删除成功' });
    } catch (error) {
        console.error('删除用户失败:', error);
        res.status(500).json({ message: '删除用户失败', error: error.message });
    }
};

// 获取所有设备
exports.getAllDevices = async (req, res) => {
    try {
        const devices = await Device.find({});
        res.status(200).json(devices);
    } catch (error) {
        console.error('获取设备列表失败:', error);
        res.status(500).json({ message: '获取设备列表失败', error: error.message });
    }
};

// 创建新设备
exports.createDevice = async (req, res) => {
    const { name, status, rotation, currency } = req.body;
    try {
        const newDevice = new Device({ name, status, rotation, currency });
        await newDevice.save();
        res.status(201).json({ message: '设备创建成功', device: newDevice });
    } catch (error) {
        console.error('创建设备失败:', error);
        res.status(500).json({ message: '创建设备失败', error: error.message });
    }
};

// 获取单个设备信息
exports.getDeviceById = async (req, res) => {
    try {
        const device = await Device.findById(req.params.id);
        if (!device) return res.status(404).json({ message: '设备不存在' });
        res.status(200).json(device);
    } catch (error) {
        console.error('获取设备信息失败:', error);
        res.status(500).json({ message: '获取设备信息失败', error: error.message });
    }
};

// 更新设备信息
exports.updateDevice = async (req, res) => {
    const { name, status, rotation, currency } = req.body;
    try {
        const device = await Device.findById(req.params.id);
        if (!device) return res.status(404).json({ message: '设备不存在' });
        
        if (name) device.name = name;
        if (status) device.status = status;
        if (rotation !== undefined) device.rotation = rotation;
        if (currency) device.currency = currency;

        await device.save();
        res.status(200).json({ message: '设备信息更新成功', device });
    } catch (error) {
        console.error('更新设备信息失败:', error);
        res.status(500).json({ message: '更新设备信息失败', error: error.message });
    }
};

// 删除设备
exports.deleteDevice = async (req, res) => {
    try {
        const device = await Device.findByIdAndDelete(req.params.id);
        if (!device) return res.status(404).json({ message: '设备不存在' });
        res.status(200).json({ message: '设备删除成功' });
    } catch (error) {
        console.error('删除设备失败:', error);
        res.status(500).json({ message: '删除设备失败', error: error.message });
    }
};

// 设备控制（开停机等）
exports.controlDevice = async (req, res) => {
    const { action } = req.body; // action 可以是 "start", "stop", "reset" 等
    try {
        const device = await Device.findById(req.params.id);
        if (!device) return res.status(404).json({ message: '设备不存在' });
        
        switch(action) {
            case 'start':
                device.status = 'online';
                break;
            case 'stop':
                device.status = 'offline';
                break;
            case 'reset':
                device.rotation = 0;
                break;
            // 添加其他操作
            default:
                return res.status(400).json({ message: '无效的操作类型' });
        }

        await device.save();
        res.status(200).json({ message: `设备操作 ${action} 成功`, device });
    } catch (error) {
        console.error(`设备操作 ${action} 失败:`, error);
        res.status(500).json({ message: '设备操作失败', error: error.message });
    }
};

// 获取用户统计
exports.getUserStatistics = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ status: 'active' });
        const adminUsers = await User.countDocuments({ role: 'admin' });
        res.status(200).json({ totalUsers, activeUsers, adminUsers });
    } catch (error) {
        console.error('获取用户统计失败:', error);
        res.status(500).json({ message: '获取用户统计失败', error: error.message });
    }
};

// 获取设备统计
exports.getDeviceStatistics = async (req, res) => {
    try {
        const totalDevices = await Device.countDocuments();
        const onlineDevices = await Device.countDocuments({ status: 'online' });
        const offlineDevices = await Device.countDocuments({ status: 'offline' });
        res.status(200).json({ totalDevices, onlineDevices, offlineDevices });
    } catch (error) {
        console.error('获取设备统计失败:', error);
        res.status(500).json({ message: '获取设备统计失败', error: error.message });
    }
};

// 获取系统设置
exports.getSettings = async (req, res) => {
    try {
        const settings = await Settings.findOne({});
        if (!settings) return res.status(404).json({ message: '系统设置不存在' });
        res.status(200).json(settings);
    } catch (error) {
        console.error('获取系统设置失败:', error);
        res.status(500).json({ message: '获取系统设置失败', error: error.message });
    }
};

// 更新系统设置
exports.updateSettings = async (req, res) => {
    const { key, value } = req.body; // 假设设置项以键值对形式存储
    try {
        const settings = await Settings.findOne({});
        if (!settings) {
            // 如果设置不存在，创建新的设置文档
            const newSettings = new Settings({ [key]: value });
            await newSettings.save();
            return res.status(201).json({ message: '系统设置创建成功', settings: newSettings });
        }

        // 更新已有的设置
        settings[key] = value;
        await settings.save();
        res.status(200).json({ message: '系统设置更新成功', settings });
    } catch (error) {
        console.error('更新系统设置失败:', error);
        res.status(500).json({ message: '更新系统设置失败', error: error.message });
    }
};

// 增加用户积分
exports.addPoints = async (req, res) => {
    const userId = req.params.id; // 从URL参数获取用户ID
    const { points } = req.body;

    if (points <= 0) {
        return res.status(400).json({ message: '积分必须为正数' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            console.log(`用户ID: ${userId} 不存在`);
            return res.status(404).json({ message: '用户不存在' });
        }

        user.currentPoints += points;
        await user.save();

        res.status(200).json({ message: '积分增加成功', user });
    } catch (error) {
        console.error('增加积分失败:', error);
        res.status(500).json({ message: '增加积分失败', error: error.message });
    }
};

// 减少用户积分
exports.deductPoints = async (req, res) => {
    const userId = req.params.id; // 从URL参数获取用户ID
    const { points } = req.body;

    if (points <= 0) {
        return res.status(400).json({ message: '积分必须为正数' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            console.log(`用户ID: ${userId} 不存在`);
            return res.status(404).json({ message: '用户不存在' });
        }

        if (user.currentPoints < points) {
            return res.status(400).json({ message: '用户积分不足' });
        }

        user.currentPoints -= points;
        await user.save();

        res.status(200).json({ message: '积分减少成功', user });
    } catch (error) {
        console.error('减少积分失败:', error);
        res.status(500).json({ message: '减少积分失败', error: error.message });
    }
};

// 封禁用户
exports.banUser = async (req, res) => {
    const userId = req.params.id; // 从URL参数获取用户ID

    try {
        const user = await User.findById(userId);
        if (!user) {
            console.log(`用户ID: ${userId} 不存在`);
            return res.status(404).json({ message: '用户不存在' });
        }

        if (user.status === 'inactive') {
            return res.status(400).json({ message: '用户已被封禁' });
        }

        user.status = 'inactive';
        await user.save();

        res.status(200).json({ message: '用户已被封禁', user });
    } catch (error) {
        console.error('封禁用户失败:', error);
        res.status(500).json({ message: '封禁用户失败', error: error.message });
    }
};

// 解封用户
exports.unbanUser = async (req, res) => {
    const userId = req.params.id; // 从URL参数获取用户ID

    try {
        const user = await User.findById(userId);
        if (!user) {
            console.log(`用户ID: ${userId} 不存在`);
            return res.status(404).json({ message: '用户不存在' });
        }

        if (user.status === 'active') {
            return res.status(400).json({ message: '用户未被封禁' });
        }

        user.status = 'active';
        await user.save();

        res.status(200).json({ message: '用户已被解封', user });
    } catch (error) {
        console.error('解封用户失败:', error);
        res.status(500).json({ message: '解封用户失败', error: error.message });
    }
};