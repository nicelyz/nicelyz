// frontend/src/pages/DeviceList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config';
import { Link } from 'react-router-dom';

function DeviceList({ userId }) {
    const [devices, setDevices] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!userId) return;
        axios.get(`${config.API_BASE_URL}/api/admin/devices`, {
            headers: { userid: userId }
        })
        .then(res => setDevices(res.data))
        .catch(err => {
            console.error(err);
            setMessage(err.response?.data?.message || '获取设备列表失败');
        });
    }, [userId]);

    if (!userId) {
        return <div>请先登录</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2>设备列表</h2>
            <ul>
                {devices.map(d => (
                    <li key={d._id}>
                        {d.name} - 状态: {d.status}
                        <Link to={`/device/${d._id}`} style={{ marginLeft: '10px' }}>查看详情</Link>
                    </li>
                ))}
            </ul>
            {message && <p style={{ color: 'red' }}>{message}</p>}
        </div>
    );
}

export default DeviceList;
