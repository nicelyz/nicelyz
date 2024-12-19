// backend/createTestUser.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User'); // 确保路径正确

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/arcade-management-system';

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('成功连接到 MongoDB'))
.catch(err => {
    console.error('连接到 MongoDB 失败:', err);
    process.exit(1);
});

const createTestUser = async () => {
    const username = 'admin'; // 管理员用户名
    const plainPassword = 'adminpassword'; // 管理员密码，请修改为安全密码

    // 检查用户是否已存在
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        console.log('管理员账号已存在');
        mongoose.connection.close();
        return;
    }

    // 哈希密码
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // 创建管理员用户
    const adminUser = new User({
        username,
        password: hashedPassword,
        role: 'admin',
    });

    try {
        await adminUser.save();
        console.log('成功创建管理员账号');
    } catch (error) {
        console.error('创建管理员账号失败:', error);
    } finally {
        mongoose.connection.close();
    }
};

// 执行创建管理员账号的函数
createTestUser();
