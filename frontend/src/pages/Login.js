// frontend/src/pages/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import config from '../config';
import { useNavigate } from 'react-router-dom';

function Login({ setUserId }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${config.API_BASE_URL}/api/auth/login`, { username, password });
            if (res.data.message === '登录成功') {
                const uid = res.data.userId;
                if (uid) {
                    localStorage.setItem('userId', uid);
                    setUserId(uid);
                    navigate('/lobby');
                } else {
                    alert('登录成功，但未收到用户ID，请联系管理员');
                }
            } else {
                alert(res.data.message);
            }
        } catch (err) {
            alert(err.response?.data?.message || '登录失败');
        }
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2>登录</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>用户名: </label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={e => setUsername(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>密码: </label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit">登录</button>
            </form>
        </div>
    );
}

export default Login;
