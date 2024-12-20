// frontend/src/pages/Login.js
import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(username, password);
        if (result.success) {
            alert('登录成功');
            navigate('/admin'); // 登录成功后导航到管理员后台
        } else {
            alert(result.message);
        }
    };

    return (
        <div className="container mt-5">
            <h2>登录</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">用户名:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">密码:</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">登录</button>
            </form>
            <p className="mt-3">
                没有账号？<Link to="/register">注册</Link>
            </p>
        </div>
    );
};

export default Login;
