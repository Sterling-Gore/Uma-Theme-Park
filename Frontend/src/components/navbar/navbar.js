
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import './navbar.css'; 

function NavBar() {
  const { isLoggedIn, userType } = useContext(AuthContext);
  console.log("NavBar Rendered → isLoggedIn:", isLoggedIn, "| userType:", userType);

  // Don't render the navbar for employees and managers
  if (isLoggedIn && (userType === 'employee' || userType === 'manager')) {
    return null; 
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">YourLogo</Link>
      </div>

      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/activities">Activities</Link>
        <Link to="/dining">Dining</Link>
        <Link to="/shop">Shop</Link>
        <Link to="/tickets">Tickets</Link>
        <Link to="/problems">Problems</Link>
        
        {!isLoggedIn ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/EmployeeLogin">Employee Login</Link>
          </>
        ) : (
          // Links for logged-in customers
          userType === 'customer' && (
            <>
              <Link to="/account">My Account</Link>
              <Link to="/logout" onClick={(e) => {
                e.preventDefault();
              }}>Logout</Link>
            </>
          )
        )}
      </div>
    </nav>
  );
}

export default NavBar;