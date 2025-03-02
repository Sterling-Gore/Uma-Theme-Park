// Frontend/src/context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage on component mount
  useEffect(() => {
    const storedLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const storedUserType = localStorage.getItem('userType');
    
    setIsLoggedIn(storedLoggedIn);
    setUserType(storedUserType || null);
    setIsLoading(false);
    
    console.log("AuthContext initialized:", storedLoggedIn, storedUserType);
  }, []);

  // Update localStorage whenever auth state changes
  useEffect(() => {
    if (!isLoading) {
      if (isLoggedIn) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userType', userType || '');
      } else {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userType');
      }
      console.log("AuthContext updated:", isLoggedIn, userType);
    }
  }, [isLoggedIn, userType, isLoading]);

  // Provide login and logout functions
  const login = (type) => {
    console.log("login called with type:", type);
    setIsLoggedIn(true);
    setUserType(type);
  };

  const logout = () => {
    console.log("logout called");
    setIsLoggedIn(false);
    setUserType(null);
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      setIsLoggedIn,
      userType, 
      setUserType,
      isLoading, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;