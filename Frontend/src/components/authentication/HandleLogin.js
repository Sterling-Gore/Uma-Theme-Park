// Frontend/src/components/authentication/HandleLogin.js

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from "../../context/AuthContext"; 

function HandleLogin() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setIsSubmitting(true);
        
        const dataToSend = {
            username: email,
            password: password
        };
        
        try {
            const response = await fetch('http://localhost:4000/login', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(dataToSend), 
            });
            
            const data = await response.json();
    
            if (response.ok) {
                console.log('Login Successful: ', data.message);
                
                // Use the login function from AuthContext - it will handle localStorage
                if (data.user) {
                    login(data.user, data.id);
                } else {
                    login('customer'); // Default to customer if type not specified
                }
                
                alert('Login Successful');
                navigate('/');
            } else {
                console.error('Error logging in: ', data.message);
                setError(data.message || 'Failed to login');
            }
        } catch (error) {
            console.error('Request failed:', error);
            setError('An error occurred while logging in');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Login</h2>
            
            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-row">
                    <div className="input-group">
                        <label className="input-label">EMAIL</label>
                        <input 
                            type="email"
                            className="input-field"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isSubmitting}
                        />
                    </div>
                </div>
                
                <div className="form-row">
                    <div className="input-group">
                        <label className="input-label">PASSWORD</label>
                        <input 
                            type="password"
                            className="input-field"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            maxLength={30}
                            minLength={8}
                            required
                            disabled={isSubmitting}
                        />
                    </div>
                </div>
                
                {error ? (
                    <p className="error-message">{error}</p>
                ) : null}
                
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

export default HandleLogin;