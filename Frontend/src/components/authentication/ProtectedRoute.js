// Frontend/src/components/authentication/ProtectedRoute.js

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

function ProtectedRoute({ element, requiredUserType }) {
  const { isLoggedIn, userType, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
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

    return <Navigate to="/login" />;
  }

  return element;
}

export default ProtectedRoute;