// frontend/src/pages/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import config from '../config';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${config.API_BASE_URL}/api/auth/register`, { username, password });
            if (res.data.message === '注册成功') {
                alert('注册成功，请登录');
                navigate('/');
            } else {
                alert(res.data.message);
            }
        } catch (err) {
            alert(err.response?.data?.message || '注册失败');
        }
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2>注册</h2>
            <form onSubmit={handleRegister}>
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
                <button type="submit">注册</button>
            </form>
        </div>
    );
}

export default Register;
