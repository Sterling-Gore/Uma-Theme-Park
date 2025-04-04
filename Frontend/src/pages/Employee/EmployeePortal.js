import React, { useEffect, useContext, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/dashboard';
import Profile from './components/profile';
import Tasks from './components/tasks';

import './EmployeePortal.css';
import AuthContext from '../../context/AuthContext';
import ShowFeedback from "./components/showFeedback";

function EmployeePortal() {
  const navigate = useNavigate();
  const { isLoggedIn, userType, isLoading } = useContext(AuthContext);
  const alertShown = useRef(false);
  const { logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('dashboard'); 


  const isManager = localStorage.getItem('userType') === "manager";

  const handleManagerPortalRedirect = () => {
    navigate('/ManagerPortal');
  };

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
  if (isLoading || userType === "Customer") {
    return null;
  }


  const handleLogout = () => {
    logout();
    fetch(`${process.env.REACT_APP_BACKEND_API}/logout`, {
      method: 'GET',
      credentials: 'include',
    }).finally(() => {
      window.location.href = '/';
    });
  };

  return (
    <div className="employee-portal">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} /> 
      <div className="content-area">
        <div className="top-bar">
        <div className="top-bar-inner-content">
          {isManager && (
            <button className="manager-portal-btn" onClick={handleManagerPortalRedirect}>
              <span className="manager-icon">🔙</span> Back to Manager Portal
            </button>
          )}
          </div>
          <div className="top-bar-inner-content-end">
          <div className="user-info">
            <span>Logged in as: {localStorage.getItem('fullName')}</span>
          </div>
          <div className="portal-actions">
            <button className="logout-btn" onClick={handleLogout}>
              <span className="logout-icon">🚪</span> Logout
            </button>
          </div>
          </div>
        </div>
        <div className="main-content">
          {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
          {activeTab === 'profile' && <Profile setActiveTab={setActiveTab} />}
          {activeTab === 'tasks' && <Tasks setActiveTab={setActiveTab} />}
          {activeTab === 'showFeedback' && <ShowFeedback setActiveTab={setActiveTab} />}


        </div>
      </div>
    </div>
  );
}

export default EmployeePortal;
