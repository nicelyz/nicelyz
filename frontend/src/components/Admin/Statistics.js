// frontend/src/components/Admin/Statistics.js
import React from 'react';

const Statistics = ({ statistics }) => {
    const { users, devices } = statistics;

    return (
        <div>
            <h3>用户统计</h3>
            <p>总用户数: {users?.totalUsers}</p>
            <p>活跃用户数: {users?.activeUsers}</p>
            <p>管理员数: {users?.adminUsers}</p>

            <h3>设备统计</h3>
            <p>总设备数: {devices?.totalDevices}</p>
            <p>在线设备数: {devices?.onlineDevices}</p>
            <p>离线设备数: {devices?.offlineDevices}</p>
        </div>
    );
};

export default Statistics;
