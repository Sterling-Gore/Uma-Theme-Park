import React, { useState, useContext } from 'react';
import './EmployeeLogin.css';
import AuthContext from "../../context/AuthContext";
import UserContext from "../../context/userContext";
import { useNavigate } from 'react-router-dom';

function EmployeeLogin() {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useContext(AuthContext);
  const { setUserType } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const dataToSend = { username: email, password };

    try {
      const response = await fetch('http://localhost:4000/employeeLogin', {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json(); 

      if (response.ok) {
        console.log('Login Successful');
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userType", "employee"); 
        setIsLoggedIn(true);
        setUserType("employee");
      
        alert('Login Successful');
        navigate('/EmployeePortal');
      } else {
        console.error('Error logging in:', data.message);
        alert(`Error: ${data.message || 'Failed to login'}`);
      }
    } catch (error) {
      console.error('Request failed:', error);
      alert('An error occurred while logging in');
    }
  };


  return (
    <div className="login-container">
      <h2>Employee Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
}

export default EmployeeLogin;
