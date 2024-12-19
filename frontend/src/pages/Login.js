// frontend/src/pages/Login.js
import React, { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ setUser }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/api/auth/login', { username, password });
            alert(res.data.message);
            // 存储令牌
            localStorage.setItem('token', res.data.token);
            // 获取用户信息
            const userInfo = await api.get('/api/auth/userinfo');
            setUser(userInfo.data);
            navigate('/admin'); // 登录成功后导航到管理员后台
        } catch (err) {
            console.error('登录失败', err);
            alert(err.response?.data?.message || '登录失败');
        }
    };

    return (
        <div>
            <h2>登录</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>用户名:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>密码:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">登录</button>
            </form>
            <p>
                没有账号？<Link to="/register">注册</Link>
            </p>
        </div>
    );
};

export default Login;
