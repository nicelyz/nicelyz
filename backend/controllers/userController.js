// backend/controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt');

// 用户注册
exports.register = async (req, res) => {
    const { username, password } = req.body;
    try {
        // 检查用户名是否已存在
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: '用户名已存在' });
        }

        // 哈希密码
        const hashedPassword = await bcrypt.hash(password, 10);

        // 创建新用户
        const newUser = new User({
            username,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({ message: '注册成功' });
    } catch (error) {
        console.error('注册失败:', error);
        res.status(500).json({ message: '注册失败', error: error.message });
    }
};

// 用户登录
exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        // 查找用户
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: '用户名或密码错误' });
        }

        // 比较密码
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: '用户名或密码错误' });
        }

        // 生成 JWT
        const token = generateToken(user);

        res.status(200).json({ message: '登录成功', token });
    } catch (error) {
        console.error('登录失败:', error); // 记录详细错误
        res.status(500).json({ message: '登录失败', error: error.message }); // 返回错误消息
    }
};

// 获取用户信息
exports.getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.id, '-password');
        if (!user) {
            return res.status(404).json({ message: '用户不存在' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('获取用户信息失败:', error);
        res.status(500).json({ message: '获取用户信息失败', error: error.message });
    }
};

// 用户登出（可选实现）
exports.logout = async (req, res) => {
    // 如果使用刷新令牌，可以在此处理刷新令牌的失效
    res.status(200).json({ message: '登出成功' });
};
