// Frontend/src/components/authentication/ProtectedRoute.js

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

function ProtectedRoute({ element, requiredUserType }) {
  const { isLoggedIn, userType, isLoading } = useContext(AuthContext);

  // Show a loading indicator while checking auth status
  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  // Check if user has the required role
  if (requiredUserType && userType !== requiredUserType) {
    // Redirect to appropriate page based on user type
    if (userType === 'customer') {
      return <Navigate to="/" />;
    } else if (userType === 'employee') {
      return <Navigate to="/EmployeePortal" />;
    } else if (userType === 'manager') {
      return <Navigate to="/ManagerPortal" />;
    }
    // Fallback to login page if userType doesn't match any known types
    return <Navigate to="/login" />;
  }

  // If all checks pass, render the protected component
  return element;
}

export default ProtectedRoute;