// frontend/src/components/Admin/DeviceList.js
import React from 'react';
import api from '../../api';

const DeviceList = ({ devices, setDevices }) => {

    const handleDelete = async (id) => {
        if (window.confirm('确定要删除此设备吗？')) {
            try {
                await api.delete(`/api/admin/devices/${id}`);
                setDevices(devices.filter(device => device._id !== id));
                alert('设备删除成功');
            } catch (err) {
                console.error('删除设备失败', err);
                alert('删除设备失败');
            }
        }
    };

    const handleUpdate = async (id, updatedData) => {
        try {
            const res = await api.put(`/api/admin/devices/${id}`, updatedData);
            setDevices(devices.map(device => device._id === id ? res.data.device : device));
            alert('设备更新成功');
        } catch (err) {
            console.error('更新设备失败', err);
            alert('更新设备失败');
        }
    };

    const handleControl = async (id, action) => {
        try {
            const res = await api.post(`/api/admin/devices/${id}/control`, { action });
            setDevices(devices.map(device => device._id === id ? res.data.device : device));
            alert(`设备操作 ${action} 成功`);
        } catch (err) {
            console.error(`设备操作 ${action} 失败`, err);
            alert(`设备操作 ${action} 失败`);
        }
    };

    return (
        <table border="1">
            <thead>
                <tr>
                    <th>设备名称</th>
                    <th>状态</th>
                    <th>旋转次数</th>
                    <th>货币类型</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                {devices.map(device => (
                    <tr key={device._id}>
                        <td>{device.name}</td>
                        <td>{device.status}</td>
                        <td>{device.rotation}</td>
                        <td>{device.currency}</td>
                        <td>
                            {/* 示例：切换设备状态 */}
                            <button onClick={() => handleUpdate(device._id, { status: device.status === 'online' ? 'offline' : 'online' })}>
                                切换状态
                            </button>
                            <button onClick={() => handleControl(device._id, 'reset')}>重置旋转次数</button>
                            <button onClick={() => handleDelete(device._id)}>删除</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default DeviceList;
