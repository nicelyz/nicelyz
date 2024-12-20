// frontend/src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import api from '../api'; // 确保 api.js 路径正确

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 在应用加载时检查本地存储中的 JWT 并获取用户信息
    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log('Found token:', token); // 调试日志
        if (token) {
            // 设置 Axios 的默认 Authorization 头
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            // 获取用户信息
            api.get('/api/auth/userinfo')
                .then((res) => {
                    console.log('User info fetched:', res.data); // 调试日志
                    setUser(res.data);
                })
                .catch((err) => {
                    console.error('获取用户信息失败', err);
                    localStorage.removeItem('token');
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    // 登录函数
    const login = async (username, password) => {
        try {
            const res = await api.post('/api/auth/login', { username, password });
            console.log('Login response:', res.data); // 调试日志
            localStorage.setItem('token', res.data.token);
            api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
            const userInfo = await api.get('/api/auth/userinfo');
            console.log('User info after login:', userInfo.data); // 调试日志
            setUser(userInfo.data);
            return { success: true };
        } catch (err) {
            console.error('登录失败', err);
            return { success: false, message: err.response?.data?.message || '登录失败' };
        }
    };

    // 登出函数
    const logout = () => {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};
