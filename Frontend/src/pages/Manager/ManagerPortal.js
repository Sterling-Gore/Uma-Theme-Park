import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ViewEmployees from './components/ViewEmployees';
import EmployeeForm from './components/EmployeeForm';
import Reports from './components/Reports';
import './ManagerPortal.css';
import AuthContext from '../../context/AuthContext';

function ManagerPortal() {
  const [activeTab, setActiveTab] = useState('view');
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {

    logout();

    fetch(`${process.env.REACT_APP_BACKEND_API}/logout`, {
      method: 'GET',
      credentials: 'include'
    }).finally(() => {
      navigate('/');
    });
  };

  return (
    <div className="manager-portal">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="content-area">
        <div className="top-bar">
          <button className="employee-portal-btn" onClick={() => navigate('/EmployeePortal')}>
            <span className="portal-icon">👷</span> Employee Portal
          </button>
          <div className="user-info">
            <span>Logged in as: {localStorage.getItem('fullName')}</span>
          </div>
          <div className="portal-actions">
            <button className="logout-btn" onClick={handleLogout}>
              <span className="logout-icon">🚪</span> Logout
            </button>
          </div>
        </div>
        <div className="main-content">
          {activeTab === 'view' && <ViewEmployees setActiveTab={setActiveTab} />}
          {activeTab === 'create' && <EmployeeForm editMode={false} setActiveTab={setActiveTab} />}
          {activeTab === 'edit' && <EmployeeForm editMode={true} setActiveTab={setActiveTab} />}
          {activeTab === 'reports' && <Reports setActiveTab={setActiveTab} />}
        </div>
      </div>
    </div>
  );
}

export default ManagerPortal;