
// Frontend/src/pages/Employee/EmployeePortal.js

import React from 'react';
import { useNavigate } from 'react-router-dom';

// This is a completely stripped down version that doesn't use any context
function EmployeePortal() {
  const navigate = useNavigate();
  
  // Very simple logout with no dependencies
  const handleLogout = () => {
    // Clear localStorage first
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userType");
    
    // Call API directly
    fetch('http://localhost:4000/logout', {
      method: 'GET',
      credentials: 'include'
    }).finally(() => {
      // Always navigate to home page regardless of API result
      window.location.href = '/';
    });
  };
  
  return (
    <div className="employee-portal">
      <h1>Employee Portal</h1>
      <p>Welcome to the employee dashboard. You are successfully logged in as an employee.</p>
      
      <h3>Quick Links</h3>
      <ul>
        <li>View Schedule</li>
        <li>Submit Time Off</li>
        <li>View Company Announcements</li>
      </ul>
      
      <button 
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}

export default EmployeePortal;

