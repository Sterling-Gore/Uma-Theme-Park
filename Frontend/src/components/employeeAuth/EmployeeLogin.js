// Frontend/src/components/employeeAuth/EmployeeLogin.js

import React, { useState, useContext, useEffect } from 'react';
import './EmployeeLogin.css';
import AuthContext from "../../context/AuthContext";
import { useNavigate } from 'react-router-dom';

function EmployeeLogin() {
  const navigate = useNavigate();
  const { login, userType, isLoading } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading) {
        if (userType === "employee") {
            navigate('/EmployeePortal');
        } else if (userType === "manager") {
            navigate('/ManagerPortal');
        }
    }
}, [userType, navigate, isLoading]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    const dataToSend = { username: email, password };

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/employeeLogin`, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json(); 

      if (response.ok) {
        console.log('Employee Login Successful');
    
        console.log(data.user)
        login(data.user, data.id, data.fullName);
        if(data.user === 'employee'){
          navigate('/EmployeePortal');
        }
        else if(data.user === 'manager'){
          navigate('/ManagerPortal')
        }
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Request failed:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Employee Login</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>
        <button 
          type="submit" 
          className="login-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default EmployeeLogin;