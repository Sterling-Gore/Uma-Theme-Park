import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleLogout } from '../../components/authentication/handleLogout'; 
import AuthContext from '../../context/AuthContext';

function EmployeePortal() {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useContext(AuthContext);
  
  return (
    <div>
      <h1>Employee Portal (Safe Mode)</h1>
      <button onClick={() => handleLogout(navigate, setIsLoggedIn)} className="logout-button">
        Logout
      </button>
    </div>
  );
}

export default EmployeePortal;
