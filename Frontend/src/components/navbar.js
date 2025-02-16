import React, { createContext, useState, useEffect, useContext } from 'react';
import { Link } from "react-router-dom";
import { BrowserRouter } from 'react-router-dom'

import './navbar.css';
function NavBar()
{
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState("");

    /*
    <BrowserRouter>
        <Link to = "/"> Dashboard </Link>
    <BrowserRouter>
    */

    return (
        <>
        <div className="Navbar">
            <div>
                <div className="NavLinks">
                    <h1>[Park Name]</h1>
                    <div className="NavLinks">
                        <a href = "/" className="NavLink1"> Dashboard </a>
                        <a href = "/activities" className="NavLink1"> Activities </a>
                        <a href = "/dining" className="NavLink1"> Dining </a>
                        <a href = "/shop" className="NavLink1"> Online Shop </a>
                        <a href = "/tickets" className="NavLink1"> Tickets </a>
                        <a href = "/problems" className="NavLink1"> Report a Problem </a>
                    </div>
                </div>
            </div>
            <div>
                <a href = "/"> Login </a>
            </div>
        </div>
        </>
        
    );
    
}


export default NavBar;