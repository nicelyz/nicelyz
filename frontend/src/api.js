// frontend/src/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000', // 后端地址
});

// 请求拦截器，自动附加 JWT
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
