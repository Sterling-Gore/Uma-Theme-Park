// Frontend/src/components/navbar/navbar.js

import React, { useContext, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import './navbar.css'; 

// Using memo to prevent unnecessary re-renders
const NavBar = memo(function NavBar() {
  const { isLoggedIn, userType, logout, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Log only when debugging is needed, commenting out to reduce console noise
  // console.log("NavBar Rendered → isLoggedIn:", isLoggedIn, "| userType:", userType);

  // Don't render anything during loading or for employee/manager
  if (isLoading || (isLoggedIn && (userType === 'employee' || userType === 'manager'))) {
    return null; 
  }

  const handleLogoutClick = (e) => {
    e.preventDefault();
    // Simple direct logout
    try {
      fetch('http://localhost:4000/logout', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      }).then(() => {
        logout();
        navigate('/');
      }).catch(() => {
        logout();
        navigate('/');
      });
    } catch (error) {
      logout();
      navigate('/');
    }
  };

  return (
    <nav className="Navbar">
      <div className="NavLogo">
        <Link to="/">ParkName</Link>
      </div>

      <div className="NavLinks">
        <Link to="/" className="NavLink1">Home</Link>
        <Link to="/activities" className="NavLink1">Activities</Link>
        <Link to="/dining" className="NavLink1">Dining</Link>
        <Link to="/shop" className="NavLink1">Shop</Link>
        <Link to="/tickets" className="NavLink1">Tickets</Link>
        <Link to="/problems" className="NavLink1">Problems</Link>
        
        {!isLoggedIn ? (
          <>
            <Link to="/login" className="NavLink1">Login</Link>
            <Link to="/register" className="NavLink1">Register</Link>
            <Link to="/EmployeeLogin" className="NavLink1">Employee Login</Link>
          </>
        ) : (
          // Links for logged-in customers
          userType === 'customer' && (
            <>
              <Link to="/account" className="NavLink1">My Account</Link>
              <Link 
                to="/" 
                className="NavLink1" 
                onClick={handleLogoutClick}
              >
                Logout
              </Link>
            </>
          )
        )}
      </div>
    </nav>
  );
});

export default NavBar;