// Frontend/src/context/AuthContext.js

import React, { createContext, useState, useEffect, useRef } from 'react';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userID, setUserID] = useState(null);
  const [fullName, setFullName] = useState(null)
  
  // Use useRef to keep track of if it's the initial mount
  const isInitialMount = useRef(true);
  // Use this flag to avoid localStorage updates during auth verification
  const skipLocalStorageUpdate = useRef(false);

  // Initial auth verification only on mount
  useEffect(() => {
    const verifyAuthStatus = async () => {
      try {
        // First set state from localStorage to prevent flicker
        const storedLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const storedUserType = localStorage.getItem('userType');
        const storedUserID = localStorage.getItem('userID');
        const storedFullName = localStorage.getItem('fullName');
        // Set initial state without triggering useEffect dependencies
        skipLocalStorageUpdate.current = true;
        setIsLoggedIn(storedLoggedIn);
        setUserType(storedUserType || null);
        setUserID(storedUserID || null);
        setFullName(storedFullName || null);

        // If stored state indicates logged in, verify with server
        if (storedLoggedIn) {
          try {
            const response = await fetch("http://localhost:4000/protected", {
              method: "GET",
              mode: 'cors',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: "include", 
            });
            
            if (!response.ok) {
              // Session expired, clear state
              skipLocalStorageUpdate.current = true;
              setIsLoggedIn(false);
              setUserType(null);
              localStorage.removeItem('isLoggedIn');
              localStorage.removeItem('userType');
              localStorage.removeItem('fullName');
            }
          } catch (error) {
            console.error("Auth verification failed:", error);
            // Keep current state on network error
          }
        }
      } finally {
        setIsLoading(false);
        skipLocalStorageUpdate.current = false;
        isInitialMount.current = false;
      }
    };
    
    verifyAuthStatus();
  }, []); // Empty dependency array - only run on mount

  // Update localStorage on state change, but not during initial load
  useEffect(() => {
    // Skip on initial mount and when skipLocalStorageUpdate is true
    if (isInitialMount.current || skipLocalStorageUpdate.current) {
      return;
    }
    
    if (isLoggedIn) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userType', userType || '');
      localStorage.setItem('userID', userID || '');
      localStorage.setItem('fullName', fullName || '');
      console.log("AuthContext updated:", isLoggedIn, userType, userID);
    } else {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userType');
      localStorage.removeItem('userID');
      localStorage.removeItem('fullName');
      console.log("AuthContext cleared");
    }
  }, [isLoggedIn, userType, userID, fullName]);

  // Login function
  const login = (type, id, fullName) => {
    localStorage.setItem("cart-tickets", JSON.stringify([]));
    localStorage.setItem("cart-merchandise", JSON.stringify([]));
    console.log("login called with type:", type);
    setIsLoggedIn(true);
    setUserType(type);
    setUserID(id);
    setFullName(fullName);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("cart-tickets", JSON.stringify([]));
    localStorage.removeItem("cart-merchandise", JSON.stringify([]));
    console.log("logout called");
    setIsLoggedIn(false);
    setUserType(null);
    setUserID(null);
    setFullName(null);
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      setIsLoggedIn,
      userType, 
      setUserType,
      userID,
      setUserID,
      isLoading, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;