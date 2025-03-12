import React, { useState, useEffect } from 'react';
import './Account.css';

function Account() {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        date_of_birth: '',
        email: '',
        phone_number: '',
        street_address: '',
        city: '',
        state: '',
        zipcode: ''
    });
    
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('http://localhost:4000/getAccountInfo', {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userID: localStorage.getItem('userID') })
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch customer info');
                }

                const data = await response.json();
            
                setFormData({
                    first_name: data.first_name || '',
                    last_name: data.last_name || '',
                    date_of_birth: data.date_of_birth.slice(0,10) || '',
                    email: data.email || '',
                    phone_number: data.phone_number || '',
                    street_address: data.street_address || '',
                    city: data.city || '',
                    state: data.state || '',
                    zipcode: data.zipcode || ''
                });
                setError(null);
            } catch (err) {
                console.error('Error fetching customer info:', err);
                setError('Failed to load account information. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchUser();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setIsLoading(true);
            const response = await fetch('http://localhost:4000/updateAccountInfo', {
                method: 'PUT',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userID: localStorage.getItem('userID'),
                    ...formData
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update account information');
            }

            setSuccessMessage('Account information updated successfully!');
            setIsEditing(false);
            
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
            
        } catch (err) {
            console.error('Error updating account info:', err);
            setError('Failed to update account information. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleEditMode = () => {
        setIsEditing(!isEditing);
        setError(null);
        setSuccessMessage('');
    };

    if (isLoading && formData.first_name === '') {
        return <div className="account-container loading">Loading account information...</div>;
    }

    return (
        <div className="account-container">
            <h1 className="account-title">My Account</h1>
            
            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
            
            <form className="account-form" onSubmit={handleSubmit}>
                <div className="form-header">
                    <h2>Personal Information</h2>
                    <button 
                        type="button" 
                        className="toggle-edit-btn"
                        onClick={toggleEditMode}
                    >
                        {isEditing ? 'Cancel' : 'Edit'}
                    </button>
                </div>
                
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="first_name">First Name</label>
                        <input
                            type="text"
                            id="first_name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="last_name">Last Name</label>
                        <input
                            type="text"
                            id="last_name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            required
                        />
                    </div>
                </div>
                
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="date_of_birth">Date of Birth</label>
                        <input
                            type="date"
                            id="date_of_birth"
                            name="date_of_birth"
                            value={formData.date_of_birth}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            required
                        />
                    </div>
                </div>
                
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="phone_number">Phone Number</label>
                        <input
                            type="tel"
                            id="phone_number"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>
                </div>
                
                <h2>Address Information</h2>
                
                <div className="form-group full-width">
                    <label htmlFor="street_address">Street Address</label>
                    <input
                        type="text"
                        id="street_address"
                        name="street_address"
                        value={formData.street_address}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                    />
                </div>
                
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="city">City</label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="state">State</label>
                        <input
                            type="text"
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="zipcode">Zip Code</label>
                        <input
                            type="text"
                            id="zipcode"
                            name="zipcode"
                            value={formData.zipcode}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>
                </div>
                
                {isEditing && (
                    <div className="form-actions">
                        <button type="submit" className="save-btn" disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}

export default Account;