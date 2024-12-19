// frontend/src/pages/DeviceDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import config from '../config';

function DeviceDetail({ userId }) {
    const { id } = useParams();
    const [device, setDevice] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const uid = userId || localStorage.getItem('userId');
        if (!uid) {
            setMessage('请先登录');
            return;
        }

        // 获取设备详情
        axios.get(`${config.API_BASE_URL}/api/admin/devices/${id}`, {
            headers: { userid: uid }
        })
        .then(res => setDevice(res.data))
        .catch(err => {
            console.error(err);
            setMessage(err.response?.data?.message || '获取设备详情失败');
        });
    }, [userId, id]);

    const handleOperation = async (url, extraData = {}) => {
        const uid = userId || localStorage.getItem('userId');
        if (!uid) {
            setMessage('请先登录');
            return;
        }

        try {
            const requestData = { deviceId: id, ...extraData };
            const res = await axios.post(`${config.API_BASE_URL}${url}`, requestData, {
                headers: { userid: uid }
            });
            setMessage(res.data.message || '操作已发送，等待反馈');
        } catch (err) {
            const errMsg = err.response?.data?.message || '操作失败';
            if (errMsg === '当前积分不足') {
                setMessage('积分不足，请为玩家加积分后再试');
            } else if (errMsg === '上分操作异常，请联系管理员') {
                setMessage('上分操作异常，请管理员解除异常状态后重试');
            } else {
                setMessage(errMsg);
            }
        }
    }

    const handleCredit = () => {
        const input = prompt("请输入上分的分数（1-2000）：", "1000");
        if (input === null) {
            // 用户取消输入
            return;
        }

        const points = parseInt(input, 10);
        if (isNaN(points) || points <= 0 || points > 2000) {
            alert("分数无效，必须为1到2000之间的数字！");
            return;
        }

        handleOperation('/api/player/credit', { points });
    }

    const uid = userId || localStorage.getItem('userId');
    if (!uid) {
        return <div>请先登录</div>;
    }

    if (!device) {
        return <div>加载中...</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2>设备详情</h2>
            <p><strong>设备名称:</strong> {device.name}</p>
            <p><strong>状态:</strong> {device.status}</p>

            <h3>操作</h3>
            <button onClick={handleCredit} style={{ marginRight: '10px' }}>上分</button>
            <button onClick={() => handleOperation('/api/player/debit')} style={{ marginRight: '10px' }}>下分</button>
            <button onClick={() => handleOperation('/api/player/changeRotation')} style={{ marginRight: '10px' }}>换转</button>
            <button onClick={() => handleOperation('/api/player/changeCurrency')} style={{ marginRight: '10px' }}>换币</button>
            <button onClick={() => handleOperation('/api/player/startStop')} style={{ marginRight: '10px' }}>开停</button>
            <button onClick={() => handleOperation('/api/player/settlement')} style={{ marginRight: '10px' }}>精算</button>

            <div style={{ marginTop: '20px', color: 'red' }}>{message}</div>
        </div>
    );
}

export default DeviceDetail;
