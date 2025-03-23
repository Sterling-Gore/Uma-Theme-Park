// Frontend/src/pages/Home/Home.js

import React, { useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import AuthContext from '../../context/AuthContext';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { userType, isLoading } = useContext(AuthContext);

  // Redirect to appropriate portal if needed
  useEffect(() => {
    if (!isLoading) {
      if (userType === "employee") {
        navigate('/EmployeePortal');
      } else if (userType === "manager") {
        navigate('/ManagerPortal');
      }
    }
  }, [userType, navigate, isLoading]);

  return (
    <div className="home-container">
      <div className="home-text">
        <h1>Blue Horizon Adventure</h1>
        <button className="buy-tickets-button" onClick={() => navigate('/tickets')}>
          Buy Tickets
        </button>
      </div>
    </div>
  );
};

export default Home;