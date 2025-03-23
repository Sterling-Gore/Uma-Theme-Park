import React, { useContext, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import './navbar.css'; 
import shoppingCartIcon from '../../assets/shopping-cart.png'
import profileIcon from '../../assets/Profile-Icon.png'

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
      fetch(`${process.env.REACT_APP_BACKEND_API}/logout`, {
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
        <Link to="/">Blue Horizon Adventure</Link>
      </div>

      <div className="NavLinks">
        <Link to="/" className="NavLink1">Home</Link>
        <Link to="/activities" className="NavLink1">Activities</Link>
        <Link to="/dining" className="NavLink1">Dining</Link>
        
        {!isLoggedIn ? (
          <>
            <Link to="/login" className="NavLink1">Login</Link>
            <Link to="/register" className="NavLink1">Register</Link>
            <Link to="/EmployeeLogin" className="NavLink1">Employee Login</Link>
          </>
        ) : (
          // Links for logged-in customers
          userType === 'Customer' && (
            <>
              <Link to="/shop" className="NavLink1">Shop</Link>
              <Link to="/tickets" className="NavLink1">Tickets</Link>
              <Link to="/problems" className="NavLink1">Report a Problem</Link>
              <Link 
                to="/" 
                className="NavLink1" 
                onClick={handleLogoutClick}
              >
                Logout
              </Link>
              <Link to="/shopping-cart" className="NavLink1"> <img src={shoppingCartIcon} alt="shoppingCartIcon" className="shoppingCartIcon-white" /> </Link>
              <Link to="/account" className="NavLink1"> <img src={profileIcon} alt="profileIcon" className="profileIcon-white" /> </Link>
            </>
          )
        )}
      </div>
    </nav>
  );
});

export default NavBar;
