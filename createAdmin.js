// backend/createAdmin.js

require('dotenv').config();
const mongoose = require('mongoose');

// 连接到 MongoDB
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

// 定义用户模型（确保与您的 User 模型一致）
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // 由于不使用加密，存储明文密码（仅限测试）
    role: { type: String, default: 'player' }, // 'admin' 或 'player'
    currentPoints: { type: Number, default: 0 },
    exceptionStatus: { type: Boolean, default: false },
    status: { type: String, default: 'active' },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// 创建管理员用户的函数
async function createAdmin() {
    const username = 'admin'; // 管理员用户名
    const plainPassword = '147208482'; // 管理员密码，请修改为安全密码

    // 检查是否已存在管理员
    const existingAdmin = await User.findOne({ username });
    if (existingAdmin) {
        console.log('管理员账号已存在');
        mongoose.connection.close();
        return;
    }

    // 创建管理员用户
    const adminUser = new User({
        username,
        password: plainPassword, // 明文密码（仅限测试）
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
}

// 执行创建管理员账号的函数
createAdmin();
