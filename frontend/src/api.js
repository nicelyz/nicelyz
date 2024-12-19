// frontend/src/api.js
import axios from 'axios';
import config from './config';

// 创建一个自定义的 Axios 实例
const api = axios.create({
    baseURL: config.API_BASE_URL
});

// 请求拦截器，自动添加 userid
api.interceptors.request.use(
    (request) => {
        const uid = localStorage.getItem('userId');
        if (uid) {
            request.headers.userid = uid;
        }
        return request;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
