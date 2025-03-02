
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleLogout } from '../../components/authentication/handleLogout'; 
import AuthContext from '../../context/AuthContext';

function EmployeePortal() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  
  return (
    <div>
      <h1>Employee Portal</h1>
      <p>Welcome to the employee dashboard. You are successfully logged in.</p>
      <button 
        onClick={() => handleLogout(navigate, logout)} 
        className="logout-button"
      >
        Logout
      </button>
    </div>
  );
}

export default EmployeePortal;