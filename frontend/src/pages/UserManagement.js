// frontend/src/pages/UserManagement.js
import React, { useEffect, useState } from 'react';
import api from '../api';
import { Modal, Button, Form } from 'react-bootstrap';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('add'); // 'add' 或 'deduct'
    const [selectedUser, setSelectedUser] = useState(null);
    const [points, setPoints] = useState(0);

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

    const handleShowModal = (user, type) => {
        setSelectedUser(user);
        setModalType(type);
        setPoints(0);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedUser(null);
        setPoints(0);
    };

    const handleSubmitPoints = async () => {
        if (points <= 0) {
            alert('请输入正整数积分');
            return;
        }

        const endpoint = modalType === 'add' ? `/api/admin/users/${selectedUser._id}/add-points` : `/api/admin/users/${selectedUser._id}/deduct-points`;

        try {
            const res = await api.post(endpoint, { points: Number(points) });
            alert(res.data.message);
            // 更新用户列表
            setUsers(users.map(user => user._id === selectedUser._id ? res.data.user : user));
            handleCloseModal();
        } catch (err) {
            console.error('操作积分失败', err);
            alert(err.response?.data?.message || '操作积分失败');
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
        <div className="container mt-5">
            <h3>用户管理</h3>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>用户名</th>
                        <th>角色</th>
                        <th>状态</th>
                        <th>积分</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            <td>{user.username}</td>
                            <td>{user.role}</td>
                            <td>{user.status}</td>
                            <td>{user.currentPoints}</td>
                            <td>
                                <Button variant="success" size="sm" className="me-2" onClick={() => handleShowModal(user, 'add')}>
                                    增加积分
                                </Button>
                                <Button variant="warning" size="sm" className="me-2" onClick={() => handleShowModal(user, 'deduct')}>
                                    减少积分
                                </Button>
                                <Button variant="danger" size="sm" onClick={() => handleDelete(user._id)}>
                                    删除
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* 积分操作模态对话框 */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalType === 'add' ? '增加积分' : '减少积分'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formPoints">
                            <Form.Label>积分数量</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                value={points}
                                onChange={(e) => setPoints(e.target.value)}
                                placeholder="请输入积分数量"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        取消
                    </Button>
                    <Button variant="primary" onClick={handleSubmitPoints}>
                        确认
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default UserManagement;
