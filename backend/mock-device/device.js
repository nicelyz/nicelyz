// mock-device/device.js
const io = require('socket.io-client');

// 配置设备ID或其他标识
const deviceId = 'device-001';

const socket = io('http://localhost:5000');

// 注册设备或通知服务器此设备已连接（如有需要）
// socket.emit('register', deviceId);

socket.on('connect', () => {
    console.log(`模拟设备 ${deviceId} 已连接至服务器, socket.id: ${socket.id}`);
});

// 监听来自服务器的指令
socket.on('command', (data) => {
  // data = { operationId, command }
  console.log('收到指令：', data);

  // 根据命令决定反馈结果
  let feedback = 'sffail'; // 默认失败反馈
if (data.command.startsWith('###sf')) {
  feedback = 'sffail'; // 故意失败反馈
}else if (data.command.startsWith('###tf')) {
    // 若为下分指令，假设也成功但使用tf<积分数>反馈，如 tf1200
    feedback = 'tf1200';
  }

  // 发送反馈
  socket.emit('feedback', { operationId: data.operationId, feedback });
});

socket.on('disconnect', () => {
    console.log(`模拟设备 ${deviceId} 与服务器断开连接`);
});
