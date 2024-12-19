// backend/utils/jwt.js
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    const payload = {
        id: user._id, // 确保包含 'id' 字段
        username: user.username,
        role: user.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    return token;
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
};

module.exports = { generateToken, verifyToken };
