
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

function ProtectedRoute({ element, requiredUserType }) {
  const { isLoggedIn, userType, isLoading } = useContext(AuthContext);

  
  if (isLoading) {
    return <div>Loading...</div>;
  }


  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }


  if (requiredUserType && userType !== requiredUserType) {
    if (userType === 'customer') {
      return <Navigate to="/" />;
    } else if (userType === 'employee') {
      return <Navigate to="/EmployeePortal" />;
    } else if (userType === 'manager') {
      return <Navigate to="/ManagerPortal" />;
    }
    // Fallback to login page
    return <Navigate to="/login" />;
  }

  // If all checks pass, render the protected component
  return element;
}

export default ProtectedRoute;