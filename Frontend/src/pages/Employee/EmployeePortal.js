import React, { useEffect, useContext, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/dashboard';
import Profile from './components/profile';
import Tasks from './components/tasks';
import HandleMerchandise from './components/HandleMerchandise';
import CreateMerchandise from './components/createMerchandise';
import Reports from './components/reports';
import './EmployeePortal.css';
import AuthContext from '../../context/AuthContext';

function EmployeePortal() {
  const navigate = useNavigate();
  const { isLoggedIn, userType, isLoading } = useContext(AuthContext);
  const alertShown = useRef(false);
  const { logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('dashboard'); // ✅ Manage activeTab state here

  // Redirect customers to their portals
  useEffect(() => {
      if (!isLoading) {
          if (userType === "Customer") {
              navigate('/');
          }  
      }
  }, [userType, navigate, isLoading]);

  // Verify auth status for ticket purchase
  useEffect(() => {
      if (!isLoading && !isLoggedIn && !alertShown.current) {
          alertShown.current = true;
          alert("Please login to access employee page!");
          navigate("/login");
      }
  }, [isLoggedIn, navigate, isLoading]);

  // Only render content after loading and redirects are done
  if (isLoading || userType === "Customer" ) {
    return null;
  }


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
          {activeTab === 'handleMerchandise' && <HandleMerchandise setActiveTab={setActiveTab}/>}
          {activeTab === 'createMerchandise' && <CreateMerchandise setActiveTab={setActiveTab}/>}
          {activeTab === 'reports' && <Reports setActiveTab={setActiveTab} />}
        </div>
      </div>
    </div>
  );
}

export default EmployeePortal;
 