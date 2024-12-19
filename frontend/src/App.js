// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import axios from 'axios';
import config from './config';

import Login from './pages/Login';
import Register from './pages/Register';
import Lobby from './pages/Lobby';
import DeviceList from './pages/DeviceList';
import DeviceDetail from './pages/DeviceDetail';
import AdminDashboard from './pages/AdminDashboard';
import api from './api'; // 使用自定义 Axios 实例

function App() {
    const [userId, setUserId] = useState(localStorage.getItem('userId') || '');
    const [currentPoints, setCurrentPoints] = useState(0);

    // 获取用户信息
    useEffect(() => {
        const fetchUserInfo = async () => {
            if (userId) {
                try {
                    const res = await api.get('/api/auth/userinfo');
                    setCurrentPoints(res.data.currentPoints || 0);
                } catch (err) {
                    console.error('获取用户信息失败', err);
                    alert(err.response?.data?.message || '获取用户信息失败');
                }
            }
        };
        fetchUserInfo();
    }, [userId]);

    // 导航栏右上角显示用户ID和积分
    return (
        <Router>
            <div className="App">
                <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #ccc' }}>
                    <div>
                        <Link to="/">登录</Link> | <Link to="/register">注册</Link> | <Link to="/lobby">大厅</Link> | <Link to="/devices">设备列表</Link> | <Link to="/admin">管理员仪表盘</Link>
                    </div>
                    <div style={{ marginRight: '20px' }}>
                        {userId ? `用户ID: ${userId} | 积分: ${currentPoints}` : '未登录'}
                    </div>
                </nav>
                <Routes>
                    <Route path="/" element={<Login setUserId={setUserId} />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/lobby" element={<Lobby />} />
                    <Route path="/devices" element={<DeviceList userId={userId} />} />
                    <Route path="/device/:id" element={<DeviceDetail userId={userId} />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
