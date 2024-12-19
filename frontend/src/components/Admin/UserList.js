// frontend/src/components/Admin/UserList.js
import React from 'react';
import api from '../../api';

const UserList = ({ users, setUsers }) => {

    const handleDelete = async (id) => {
        if (window.confirm('确定要删除此用户吗？')) {
            try {
                await api.delete(`/api/admin/users/${id}`);
                setUsers(users.filter(user => user._id !== id));
                alert('用户删除成功');
            } catch (err) {
                console.error('删除用户失败', err);
                alert('删除用户失败');
            }
        }
    };

    const handleUpdate = async (id, updatedData) => {
        try {
            const res = await api.put(`/api/admin/users/${id}`, updatedData);
            setUsers(users.map(user => user._id === id ? res.data.user : user));
            alert('用户更新成功');
        } catch (err) {
            console.error('更新用户失败', err);
            alert('更新用户失败');
        }
    };

    return (
        <table border="1">
            <thead>
                <tr>
                    <th>用户名</th>
                    <th>角色</th>
                    <th>当前积分</th>
                    <th>状态</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                {users.map(user => (
                    <tr key={user._id}>
                        <td>{user.username}</td>
                        <td>{user.role}</td>
                        <td>{user.currentPoints}</td>
                        <td>{user.status}</td>
                        <td>
                            {/* 示例：切换用户角色 */}
                            <button onClick={() => handleUpdate(user._id, { role: user.role === 'admin' ? 'player' : 'admin' })}>
                                切换角色
                            </button>
                            <button onClick={() => handleDelete(user._id)}>删除</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default UserList;
