import React, { createContext, useState, useEffect, useContext } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const Logout = () =>{

    const navigate = useNavigate();
    useEffect(() => {
            const handleLogout = async () =>{
                try {
                    const response = await fetch('http://localhost:4000/logout', {
                        method: 'GET',
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials : 'include'
                    });

                    const data = await response.json();

                    if(response.ok){
                        console.log('Successfully logout: ', data.message);
                        navigate('/')
                    }
                    else {
                        console.error('Error loggin in: ', data.message);
                        alert(`Error: ${data.message || 'Failed to logout'}`);
                    }
                } catch(error){
                    console.log(error);
                }
            }
            handleLogout();
        }, [navigate]);

    return null;
}

export default Logout