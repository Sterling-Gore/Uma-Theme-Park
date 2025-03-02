import React, { createContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userType, setUserType] = useState(null); 

    useEffect(() => {
        const storedUserType = localStorage.getItem("userType");
        if (storedUserType) {
            setUserType(storedUserType);
        }
    }, []);

    return (
        <UserContext.Provider value={{ userType, setUserType }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
