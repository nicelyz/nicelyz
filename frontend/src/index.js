// frontend/src/index.js
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css'; // 引入 Toastify 样式
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ToastContainer } from 'react-toastify';

ReactDOM.render(
    <React.StrictMode>
        <App />
        <ToastContainer />
    </React.StrictMode>,
    document.getElementById('root')
);
