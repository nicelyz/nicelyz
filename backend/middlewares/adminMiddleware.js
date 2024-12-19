// backend/middlewares/adminMiddleware.js
const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: '禁止访问，管理员权限所需' });
    }
};

module.exports = adminMiddleware;
