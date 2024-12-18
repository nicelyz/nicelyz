const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*", // 生产环境请指定具体域名
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

// 测试路由
app.get('/', (req, res) => {
    res.send('Arcade Management System Backend');
});

// Socket.IO 连接
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
