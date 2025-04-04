import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ViewEmployees from './components/ViewEmployees';
import AttractionAssignment from './components/AttractionAssignment';
import HandleMerchandise from './components/MerchTab/HandleMerchandise';
import CreateMerchandise from './components/MerchTab/createMerchandise';
import HandleAttraction from './components/attractionTab/handleAttraction';
import CreateAttraction from './components/attractionTab/createAttraction';
import HandleDining from './components/diningTab/handleDining';
import CreateDining from './components/diningTab/createDining';
import CreateEmployee from './components/CreateEmployee';
import './ManagerPortal.css';
import AuthContext from '../../context/AuthContext';
import FinanceReport from './components/FinanceReport';
import AttractReport from './components/attractReport';

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
          {activeTab === 'create' && <CreateEmployee setActiveTab={setActiveTab} />}
          {activeTab === 'assign' && <AttractionAssignment setActiveTab={setActiveTab} />}
          {activeTab === 'financeReport' && <FinanceReport setActiveTab={setActiveTab} />}
          {activeTab === 'AttractReport' && <AttractReport setActiveTab={setActiveTab} />}
          {activeTab === 'handleMerchandise' && <HandleMerchandise setActiveTab={setActiveTab} />}
          {activeTab === 'createMerchandise' && <CreateMerchandise setActiveTab={setActiveTab} />}
          {activeTab === 'handleAttractions' && <HandleAttraction setActiveTab={setActiveTab} />}
          {activeTab === 'createAttraction' && <CreateAttraction setActiveTab={setActiveTab} />}
          {activeTab === 'handleDining' && <HandleDining setActiveTab={setActiveTab} />}
          {activeTab === 'createDining' && <CreateDining setActiveTab={setActiveTab} />}
        </div>
      </div>
    </div>
  );
}

export default ManagerPortal;