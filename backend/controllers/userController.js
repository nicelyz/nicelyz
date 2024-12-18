// backend/controllers/userController.js
const User = require('../models/User');

exports.register = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: '用户名和密码为必填项' });
    }

    // 检查用户名是否已存在
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ message: '用户名已被注册' });
    }

    // 创建新用户（明文密码存储，测试阶段不加密）
    const newUser = new User({ username, password });
    await newUser.save();

    return res.status(201).json({ message: '注册成功' });
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: '用户名和密码为必填项' });
    }

    const user = await User.findOne({ username });
    if (!user) {
        return res.status(400).json({ message: '用户名或密码错误' });
    }

    // 无加密，直接比较明文密码
    if (user.password !== password) {
        return res.status(400).json({ message: '用户名或密码错误' });
    }

    return res.status(200).json({ message: '登录成功' });
};
