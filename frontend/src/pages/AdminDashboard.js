// frontend/src/pages/AdminDashboard.js
import React, { useContext } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import UserManagement from './UserManagement';
import { AuthContext } from '../contexts/AuthContext';
// 导入其他管理页面组件，如 DeviceManagement, Statistics, Settings

const AdminDashboard = () => {
    const { user, logout } = useContext(AuthContext);

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
                    <li><button onClick={logout}>登出</button></li>
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
