// frontend/src/pages/UserManagement.js
import React, { useEffect, useState } from 'react';
import api from '../api';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // 积分操作模态对话框状态
    const [showPointsModal, setShowPointsModal] = useState(false);
    const [modalType, setModalType] = useState('add'); // 'add' 或 'deduct'
    const [selectedUser, setSelectedUser] = useState(null);
    const [points, setPoints] = useState(0);

    // 编辑用户模态对话框状态
    const [showEditModal, setShowEditModal] = useState(false);
    const [editUsername, setEditUsername] = useState('');
    const [editRole, setEditRole] = useState('');
    const [editStatus, setEditStatus] = useState('');

    // 封禁/解封用户模态对话框状态
    const [showBanModal, setShowBanModal] = useState(false);
    const [banAction, setBanAction] = useState('ban'); // 'ban' 或 'unban'

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
            toast.error(err.response?.data?.message || '获取用户列表失败');
            setLoading(false);
        }
    };

    // 积分操作相关函数
    const handleShowPointsModal = (user, type) => {
        setSelectedUser(user);
        setModalType(type);
        setPoints(0);
        setShowPointsModal(true);
    };

    const handleClosePointsModal = () => {
        setShowPointsModal(false);
        setSelectedUser(null);
        setPoints(0);
    };

    const handleSubmitPoints = async () => {
        const parsedPoints = parseInt(points, 10);
        if (isNaN(parsedPoints) || parsedPoints <= 0) {
            toast.warning('请输入有效的正整数积分');
            return;
        }

        const endpoint = modalType === 'add' ? `/api/admin/users/${selectedUser._id}/add-points` : `/api/admin/users/${selectedUser._id}/deduct-points`;

        try {
            const res = await api.post(endpoint, { points: parsedPoints });
            toast.success(res.data.message);
            // 更新用户列表
            setUsers(users.map(user => user._id === selectedUser._id ? res.data.user : user));
            handleClosePointsModal();
        } catch (err) {
            console.error('操作积分失败:', err);
            if (err.response && err.response.data && err.response.data.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error('操作积分失败');
            }
        }
    };

    // 编辑用户相关函数
    const handleShowEditModal = (user) => {
        setSelectedUser(user);
        setEditUsername(user.username);
        setEditRole(user.role);
        setEditStatus(user.status);
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setSelectedUser(null);
        setEditUsername('');
        setEditRole('');
        setEditStatus('');
    };

    const handleSubmitEdit = async () => {
        if (!editUsername.trim()) {
            toast.warning('用户名不能为空');
            return;
        }

        const payload = {
            username: editUsername,
            role: editRole,
            status: editStatus
        };

        try {
            const res = await api.put(`/api/admin/users/${selectedUser._id}`, payload);
            toast.success(res.data.message);
            // 更新用户列表
            setUsers(users.map(user => user._id === selectedUser._id ? res.data.user : user));
            handleCloseEditModal();
        } catch (err) {
            console.error('编辑用户失败:', err);
            if (err.response && err.response.data && err.response.data.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error('编辑用户失败');
            }
        }
    };

    // 封禁/解封用户相关函数
    const handleShowBanModal = (user, action) => {
        setSelectedUser(user);
        setBanAction(action);
        setShowBanModal(true);
    };

    const handleCloseBanModal = () => {
        setShowBanModal(false);
        setSelectedUser(null);
        setBanAction('ban');
    };

    const handleSubmitBan = async () => {
        const endpoint = banAction === 'ban' ? `/api/admin/users/${selectedUser._id}/ban` : `/api/admin/users/${selectedUser._id}/unban`;

        try {
            const res = await api.post(endpoint);
            toast.success(res.data.message);
            // 更新用户列表
            setUsers(users.map(user => user._id === selectedUser._id ? res.data.user : user));
            handleCloseBanModal();
        } catch (err) {
            console.error(`${banAction === 'ban' ? '封禁' : '解封'}用户失败:`, err);
            if (err.response && err.response.data && err.response.data.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error(`${banAction === 'ban' ? '封禁' : '解封'}用户失败`);
            }
        }
    };

    // 删除用户函数
    const handleDelete = async (userId) => {
        if (window.confirm('确定要删除这个用户吗？')) {
            try {
                await api.delete(`/api/admin/users/${userId}`);
                setUsers(users.filter(user => user._id !== userId));
                toast.success('用户删除成功');
            } catch (err) {
                console.error('删除用户失败', err);
                toast.error(err.response?.data?.message || '删除用户失败');
            }
        }
    };

    if (loading) {
        return <p>加载中...</p>;
    }

    return (
        <div className="container mt-5">
            <h3>用户管理</h3>
            <Table bordered>
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
                            <td>{user.status === 'active' ? '正常' : '封禁'}</td>
                            <td>{user.currentPoints}</td>
                            <td>
                                <Button variant="success" size="sm" className="me-2" onClick={() => handleShowPointsModal(user, 'add')}>
                                    增加积分
                                </Button>
                                <Button variant="warning" size="sm" className="me-2" onClick={() => handleShowPointsModal(user, 'deduct')}>
                                    减少积分
                                </Button>
                                <Button variant="primary" size="sm" className="me-2" onClick={() => handleShowEditModal(user)}>
                                    编辑
                                </Button>
                                {user.status === 'active' ? (
                                    <Button variant="danger" size="sm" className="me-2" onClick={() => handleShowBanModal(user, 'ban')}>
                                        封禁
                                    </Button>
                                ) : (
                                    <Button variant="success" size="sm" className="me-2" onClick={() => handleShowBanModal(user, 'unban')}>
                                        解封
                                    </Button>
                                )}
                                <Button variant="secondary" size="sm" onClick={() => handleDelete(user._id)}>
                                    删除
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* 积分操作模态对话框 */}
            <Modal show={showPointsModal} onHide={handleClosePointsModal}>
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
                    <Button variant="secondary" onClick={handleClosePointsModal}>
                        取消
                    </Button>
                    <Button variant="primary" onClick={handleSubmitPoints}>
                        确认
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* 编辑用户模态对话框 */}
            <Modal show={showEditModal} onHide={handleCloseEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>编辑用户</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formUsername">
                            <Form.Label>用户名</Form.Label>
                            <Form.Control
                                type="text"
                                value={editUsername}
                                onChange={(e) => setEditUsername(e.target.value)}
                                placeholder="请输入用户名"
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formRole" className="mt-3">
                            <Form.Label>角色</Form.Label>
                            <Form.Select value={editRole} onChange={(e) => setEditRole(e.target.value)}>
                                <option value="player">玩家</option>
                                <option value="admin">管理员</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group controlId="formStatus" className="mt-3">
                            <Form.Label>状态</Form.Label>
                            <Form.Select value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                                <option value="active">正常</option>
                                <option value="inactive">封禁</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEditModal}>
                        取消
                    </Button>
                    <Button variant="primary" onClick={handleSubmitEdit}>
                        确认
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* 封禁/解封用户模态对话框 */}
            <Modal show={showBanModal} onHide={handleCloseBanModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{banAction === 'ban' ? '封禁用户' : '解封用户'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>确定要{banAction === 'ban' ? '封禁' : '解封'}用户 <strong>{selectedUser?.username}</strong> 吗？</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseBanModal}>
                        取消
                    </Button>
                    <Button variant={banAction === 'ban' ? 'danger' : 'success'} onClick={handleSubmitBan}>
                        确认
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );

}; // 这里是组件函数的闭合

export default UserManagement; // 确保 export 语句在函数外部
