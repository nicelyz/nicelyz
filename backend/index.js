// backend/index.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*", // 测试阶段允许所有来源
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

// 连接MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB connected");
}).catch(err => {
    console.error("MongoDB connection error:", err);
});

// 导入路由和控制器
const userRoutes = require('./routes/userRoutes');
const playerController = require('./controllers/playerController');
const playerRoutes = require('./routes/playerRoutes');
const adminRoutes = require('./routes/adminRoutes');
// 将io实例传递给playerController，便于在controller中发送socket事件
playerController.setIO(io);

// 使用路由
app.use('/api/auth', userRoutes);
app.use('/api/player', playerRoutes);
app.use('/api/admin', adminRoutes);

// 测试路由
app.get('/', (req, res) => {
    res.send('Arcade Management System Backend');
});

// Socket.IO 连接事件
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
