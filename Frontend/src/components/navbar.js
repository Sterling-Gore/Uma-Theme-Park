import React, { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import AuthContext from '../context/AuthContext';
import { handleLogout } from './handleLogout'; // Import function
import './navbar.css';

function NavBar() {
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <div className="Navbar">
            <div className="NavLinks">
                <h1 className="NavLogo">[Park Name]</h1>
                <a href="/">Dashboard</a>
                <a href="/activities">Activities</a>
                <a href="/dining">Dining</a>
                <a href="/shop">Online Shop</a>
                <a href="/tickets">Tickets</a>
                <a href="/problems">Report a Problem</a>
            </div>
            <div>
                {isLoggedIn ? (
                    <button onClick={() => handleLogout(navigate, setIsLoggedIn)} className="logout-button">
                        Logout
                    </button>
                ) : (
                    <>
                        <a href="/login">Login</a>
                        <a href="/register">Register</a>
                    </>
                )}
            </div>
        </div>
    );
}

export default NavBar;
