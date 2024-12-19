// frontend/src/pages/UserManagement.js
import React, { useEffect, useState } from 'react';
import api from '../api';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/api/admin/users');
            setUsers(res.data);
            setLoading(false);
        } catch (err) {
            console.error('获取用户列表失败', err);
            alert(err.response?.data?.message || '获取用户列表失败');
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm('确定要删除这个用户吗？')) {
            try {
                await api.delete(`/api/admin/users/${userId}`);
                setUsers(users.filter(user => user._id !== userId));
                alert('用户删除成功');
            } catch (err) {
                console.error('删除用户失败', err);
                alert(err.response?.data?.message || '删除用户失败');
            }
        }
    };

    if (loading) {
        return <p>加载中...</p>;
    }

    return (
        <div>
            <h2>用户管理</h2>
            <table>
                <thead>
                    <tr>
                        <th>用户名</th>
                        <th>角色</th>
                        <th>状态</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            <td>{user.username}</td>
                            <td>{user.role}</td>
                            <td>{user.status}</td>
                            <td>
                                {/* 添加编辑功能后，可以在这里添加编辑按钮 */}
                                <button onClick={() => handleDelete(user._id)}>删除</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserManagement;
