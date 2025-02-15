import React, { createContext, useState, useEffect, useContext } from 'react';


function NavBar()
{
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState("");


    return (
        <h1>NAVBAR</h1>
    );
    
}


export default NavBar;