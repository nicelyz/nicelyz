// frontend/src/pages/Register.js
import React, { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/api/auth/register', { username, password });
            alert(res.data.message);
            navigate('/login');
        } catch (err) {
            console.error('注册失败', err);
            alert(err.response?.data?.message || '注册失败');
        }
    };

    return (
        <div>
            <h2>注册</h2>
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
                <button type="submit">注册</button>
            </form>
            <p>
                已有账号？<Link to="/login">登录</Link>
            </p>
        </div>
    );
};

export default Register;
