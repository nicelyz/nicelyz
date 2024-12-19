// backend/middlewares/authMiddleware.js
const { verifyToken } = require('../utils/jwt');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: '未授权，请登录' });
    }

    const token = authHeader.split(' ')[1]; // 期望格式为 "Bearer <token>"
    if (!token) {
        return res.status(401).json({ message: '未授权，请登录' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ message: '无效的令牌，请重新登录' });
    }

    req.user = decoded; // 确保 JWT payload 包含 'id' 字段
    next();
};

module.exports = authMiddleware;
