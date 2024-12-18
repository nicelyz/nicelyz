// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DeviceList from './pages/DeviceList';
import DeviceDetail from './pages/DeviceDetail';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="App">
        {/* 可以在这里添加导航栏，右上角显示玩家ID和积分 */}
        <Routes>
          <Route path="/" element={<DeviceList />} />
          <Route path="/device/:id" element={<DeviceDetail />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
