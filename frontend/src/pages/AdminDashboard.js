// frontend/src/pages/AdminDashboard.js
import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import UserManagement from './UserManagement';
// 导入其他管理页面组件，如 DeviceManagement, Statistics, Settings

const AdminDashboard = ({ user }) => {
    return (
        <div>
            <h2>管理员后台</h2>
            <p>欢迎, {user.username}!</p>
            <nav>
                <ul>
                    <li><Link to="users">用户管理</Link></li>
                    <li><Link to="devices">设备管理</Link></li>
                    <li><Link to="statistics">数据统计</Link></li>
                    <li><Link to="settings">系统设置</Link></li>
                </ul>
            </nav>
            <Routes>
                <Route path="users" element={<UserManagement />} />
                {/* 添加其他路由，如
                    <Route path="devices" element={<DeviceManagement />} />
                    <Route path="statistics" element={<Statistics />} />
                    <Route path="settings" element={<Settings />} />
                */}
                <Route path="*" element={<p>请选择一个功能</p>} />
            </Routes>
        </div>
    );
};

export default AdminDashboard;
