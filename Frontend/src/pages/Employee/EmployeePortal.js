import React, { useState, useContext } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/dashboard';
import Profile from './components/profile';
import Tasks from './components/tasks';
import Reports from './components/reports';
import './EmployeePortal.css';
import AuthContext from '../../context/AuthContext';

function EmployeePortal() {
  const { logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('dashboard'); // ✅ Manage activeTab state here

  const handleLogout = () => {
    logout();
    fetch('http://localhost:4000/logout', {
      method: 'GET',
      credentials: 'include',
    }).finally(() => {
      window.location.href = '/';
    });
  };

  return (
    <div className="employee-portal">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} /> {/* ✅ Pass setActiveTab to Sidebar */}
      <div className="content-area">
        <div className="top-bar">
          <div className="user-info">
            <span>Logged in as: {localStorage.getItem('fullName')}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <span className="logout-icon">🚪</span> Logout
          </button>
        </div>
        <div className="main-content">
          {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
          {activeTab === 'profile' && <Profile setActiveTab={setActiveTab} />}
          {activeTab === 'tasks' && <Tasks setActiveTab={setActiveTab} />}
          {activeTab === 'reports' && <Reports setActiveTab={setActiveTab} />}
        </div>
      </div>
    </div>
  );
}

export default EmployeePortal;
