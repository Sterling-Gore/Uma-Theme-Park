import React, { useEffect, useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import './Account.css';

function Account() {
    const navigate = useNavigate();
    const { isLoggedIn, userType, isLoading } = useContext(AuthContext);
    const alertShown = useRef(false);
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

    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    });

    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [isLoadingPage, setIsLoadingPage] = useState(true);
    const [error, setError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [formError, setFormError] = useState("");
    const [passwordFormError, setPasswordFormError] = useState("");
    const [step, setStep] = useState(1);

    // Redirect employees and managers to their portals
    useEffect(() => {
        if (!isLoading) {
            if (userType === "employee") {
                navigate('/EmployeePortal');
            } else if (userType === "manager") {
                navigate('/ManagerPortal');
            }
        }
    }, [userType, navigate, isLoading]);

    // Verify auth status for ticket purchase
    useEffect(() => {
        if (!isLoading && !isLoggedIn && !alertShown.current) {
            alertShown.current = true;
            alert("Please login to purchase tickets!");
            navigate("/login");
        }
    }, [isLoggedIn, navigate, isLoading]);

    useEffect(() => {
        const fetchUser = async () => {
            setIsLoadingPage(true);
            try {
                // Use URL parameters for GET request instead of body
                const userID = localStorage.getItem('userID');
                const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/getAccountInfo`, {
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
                    date_of_birth: data.date_of_birth.slice(0, 10) || '',
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
                setIsLoadingPage(false);
            }
        };

        fetchUser();
    }, []);



    const validateEmail = (email) => {
        return email.match(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
        
      };

    const checkBirthdate = (date) => {
        const today = new Date();
        const birthday = new Date(date);

        let years = today.getFullYear() - birthday.getFullYear();


        // Adjust if the full year hasn't passed yet
        if (
            today.getMonth() < birthday.getMonth() || 
            (today.getMonth() === birthday.getMonth() && today.getDate() < (birthday.getDate()+1))
        ) {
            years--;
        }

        return years;

    };


    function checkError()
    {
        console.log("CHECKING...")
        console.log(formData.phone_number.length)
        console.log(formError)
        if ( formData.first_name === "")
        {
            setFormError("Fill in First Name");
            return true;
        }
        if ( formData.last_name === "")
        {
            setFormError("Fill in Last Name");
            return true;
        }
        if ( formData.email === "")
        {
            setFormError("Fill in Email");
            return true;
        }
        if ( !validateEmail(formData.email))
        {
            setFormError("Must Enter a Valid Email");
            return true;
        }
        if ( formData.phone_number === '')
        {
            setFormError("Fill in Phone Number");
            return true;
        }
        if ( formData.phone_number.length < 10)
        {
            setFormError("Phone Number Must Have 10 Digits");
            return true;
        }
        if ( formData.date_of_birth === "")
        {
            setFormError("Fill in data of birth");
            return true;
        }
        if (checkBirthdate(formData.date_of_birth) < 13)
        {
            setFormError("Must be at least 13 years old")
            return true;
        }        
        if ( formData.street_address === "")
        {
            setFormError("Fill in Street Address");
            return true;
        }
        if ( formData.city === "")
        {
            setFormError("Fill in City");
            return true;
        }
        if ( formData.state === "")
        {
            setFormError("Fill in State");
            return true;
        }
        if ( formData.zip === "")
        {
            setFormError("Fill in Zipcode");
            return true;
        }
        if ( formData.zipcode.length < 5)
        {
            setFormError("Zipcode Must Have 5 Digits");
            return true;
        }
            
        
        setFormError("");
        return false;
    }

    useEffect(() => {
        checkError();
    }, [formData])


    function checkPasswordError()
    {
        console.log(passwordData.new_password);
        console.log(passwordData.confirm_password);
        if (passwordData.current_password === "")
        {
            setPasswordFormError("Fill in Current Password");
            return true;
        }
        if ( passwordData.new_password === "")
        {
            setPasswordFormError("Fill in New Password");
            return true;
        }
        if ( passwordData.new_password.length < 8)
        {
            setPasswordFormError("New Password Must be at Least 8 Characters Long");
            return true;
        }
        if ( passwordData.confirm_password === "")
        {
            setPasswordFormError("Fill in Confirm Password");
            return true;
        }
        if ( passwordData.confirm_password.length < 8)
        {
            setPasswordFormError("Confirm Password Must be at Least 8 Characters Long");
            return true;
        }
        if ( passwordData.confirm_password !== passwordData.new_password)
        {
            setPasswordFormError("Confirm Password Must Match New Password");
            return true;
        }
            
        
        setPasswordFormError("");
        return false;
    }

    useEffect(() => {
        checkPasswordError();
    }, [passwordData])

    // Only render content after loading and redirects are done
    if (isLoading || userType === "employee" || userType === "manager") {
        return null;
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const togglePasswordChange = () => {
        setIsChangingPassword(!isChangingPassword);
        setPasswordData({
            current_password: '',
            new_password: '',
            confirm_password: ''
        });
        setPasswordError(null);
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        // Validate passwords match
        if (passwordData.new_password !== passwordData.confirm_password) {
            setPasswordError("New passwords don't match");
            return;
        }

        // Validate password strength
        if (passwordData.new_password.length < 8) {
            setPasswordError("Password must be at least 8 characters long");
            return;
        }

        try {
            setIsLoadingPage(true);
            const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/updatePassword`, {
                method: 'PUT',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userID: localStorage.getItem('userID'),
                    current_password: passwordData.current_password,
                    new_password: passwordData.new_password
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update password');
            }

            setSuccessMessage('Password updated successfully!');
            setIsChangingPassword(false);

            // Hide success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);

        } catch (err) {
            console.error('Error updating password:', err);
            setPasswordError(err.message || 'Failed to update password. Please try again.');
        } finally {
            setIsLoadingPage(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setIsLoadingPage(true);
            const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/updateAccountInfo`, {
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

            // Hide success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);

        } catch (err) {
            console.error('Error updating account info:', err);
            setError('Failed to update account information. Please try again.');
        } finally {
            setIsLoadingPage(false);
        }
    };

    const toggleEditMode = () => {
        setIsEditing(!isEditing);
        setError(null);
        setSuccessMessage('');
        // Close password form if open
        if (isChangingPassword) {
            setIsChangingPassword(false);
        }
    };

    function cancelDeletion(){
        setStep(1);
        setIsEditing(false);
        setIsChangingPassword(false);
    }

    const confirmDeletion = async () => {
        try {
            const userID = localStorage.getItem('userID');
            const dataToSend = {
                id : userID,
            }
            const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/deleteAccount`, {
            method: 'POST',
            credentials: 'include',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend),
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete account');
        }
        
        
        //logout

        } catch (error) {
            console.error('Error deleting account:', error);
            alertShown.current = true;
            alert("Error deleting account");
        }
    };

    if (isLoadingPage && formData.first_name === '') {
        return <div className="account-container loading">Loading account information...</div>;
    }

    return (
        <>
        {step === 1 && (
        <div className="account-container">
            <div className="navigation-buttons">
                <button
                    className="nav-btn"
                    onClick={() => window.location.href = '/myorders'}
                >
                    My Tickets
                </button>
                <button
                    className="nav-btn"
                    onClick={() => window.location.href = '/merchandise-orders'}
                >
                    Merchandise Orders
                </button>
            </div>
            <h1 className="account-title">My Account</h1>

            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}

            <form className="account-form" onSubmit={handleSubmit}>
                <div className="form-header">
                    <h2>Personal Information</h2>
                    {!isChangingPassword && (
                    <button
                        type="button"
                        className="toggle-edit-btn"
                        onClick={toggleEditMode}
                    >
                        {isEditing ? 'Cancel' : 'Edit'}
                    </button>
                    )}
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="first_name">First Name</label>
                        <input
                            type="text"
                            id="first_name"
                            name="first_name"
                            value={formData.first_name}
                            //onChange={handleInputChange}
                            onChange={(e) => {
                                const onlyLetters = e.target.value.replace(/[^a-zA-Z]/g, ""); // Remove non-alphabet characters
                                setFormData({ ...formData, first_name: onlyLetters });
                                //checkError();
                              }}  
                            maxLength="50"
                            minLength="1"
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
                            //onChange={handleInputChange}
                            onChange={(e) => {
                                const onlyLetters = e.target.value.replace(/[^a-zA-Z]/g, ""); // Remove non-alphabet characters
                                setFormData({ ...formData, last_name: onlyLetters });
                                //checkError();
                            }}    
                            maxLength="50"
                            minLength="1"
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
                            //onChange={handleInputChange}
                            onChange={(e) => {
                                setFormData({ ...formData, date_of_birth: e.target.value});
                                //checkError();
                            }}
                            max={new Date().toISOString().split('T')[0]}
                            //disabled={!isEditing}
                            disabled={true}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            //onChange={handleInputChange}
                            onChange={(e) => {
                                setFormData({ ...formData, email: e.target.value});
                                //checkError();
                            }}
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
                            //onChange={handleInputChange}
                            onChange={(e) => {
                                const onlyDigits = e.target.value.replace(/\D/g, ""); // Remove non-digits
                                setFormData({ ...formData, phone_number: onlyDigits});
                                //checkError();
                            }}
                            maxLength={10}
                            minLength={10}
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
                        //onChange={handleInputChange}
                        onChange={(e) => {
                            setFormData({ ...formData, street_address: e.target.value})
                            //checkError();
                        }}
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
                            //onChange={handleInputChange}
                            onChange={(e) => {
                                setFormData({ ...formData, city: e.target.value});
                                //checkError();
                            }}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="state">State</label>
                        <select 
                            type="text"
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={(e) => {
                                setFormData({ ...formData, state: e.target.value });
                                //checkError();
                            }}
                            disabled={!isEditing}
                            required
                        >
                            <option value="">Select State</option>
                            <option value="AL">Alabama</option>
                            <option value="AK">Alaska</option>
                            <option value="AZ">Arizona</option>
                            <option value="AR">Arkansas</option>
                            <option value="CA">California</option>
                            <option value="CO">Colorado</option>
                            <option value="CT">Connecticut</option>
                            <option value="DE">Delaware</option>
                            <option value="FL">Florida</option>
                            <option value="GA">Georgia</option>
                            <option value="HI">Hawaii</option>
                            <option value="ID">Idaho</option>
                            <option value="IL">Illinois</option>
                            <option value="IN">Indiana</option>
                            <option value="IA">Iowa</option>
                            <option value="KS">Kansas</option>
                            <option value="KY">Kentucky</option>
                            <option value="LA">Louisiana</option>
                            <option value="ME">Maine</option>
                            <option value="MD">Maryland</option>
                            <option value="MA">Massachusetts</option>
                            <option value="MI">Michigan</option>
                            <option value="MN">Minnesota</option>
                            <option value="MS">Mississippi</option>
                            <option value="MO">Missouri</option>
                            <option value="MT">Montana</option>
                            <option value="NE">Nebraska</option>
                            <option value="NV">Nevada</option>
                            <option value="NH">New Hampshire</option>
                            <option value="NJ">New Jersey</option>
                            <option value="NM">New Mexico</option>
                            <option value="NY">New York</option>
                            <option value="NC">North Carolina</option>
                            <option value="ND">North Dakota</option>
                            <option value="OH">Ohio</option>
                            <option value="OK">Oklahoma</option>
                            <option value="OR">Oregon</option>
                            <option value="PA">Pennsylvania</option>
                            <option value="RI">Rhode Island</option>
                            <option value="SC">South Carolina</option>
                            <option value="SD">South Dakota</option>
                            <option value="TN">Tennessee</option>
                            <option value="TX">Texas</option>
                            <option value="UT">Utah</option>
                            <option value="VT">Vermont</option>
                            <option value="VA">Virginia</option>
                            <option value="WA">Washington</option>
                            <option value="WV">West Virginia</option>
                            <option value="WI">Wisconsin</option>
                            <option value="WY">Wyoming</option>
                        </select>
                        {/*
                        <input
                            type="text"
                            id="state"
                            name="state"
                            value={formData.state}
                            //onChange={handleInputChange}
                            onChange={(e) => {
                                setFormData({ ...formData, state: e.target.value });
                                //checkError();
                            }}
                            disabled={!isEditing}
                        /> */}
                    </div>

                    <div className="form-group">
                        <label htmlFor="zipcode">Zip Code</label>
                        <input
                            type="text"
                            id="zipcode"
                            name="zipcode"
                            value={formData.zipcode}
                            //onChange={handleInputChange}
                            onChange={(e) => {
                                const onlyDigits = e.target.value.replace(/\D/g, ""); // Remove non-digits
                                setFormData({ ...formData, zipcode: onlyDigits});
                                //checkError();
                            }}
                            maxLength="5"
                            minLength="5"
                            pattern="\d*"
                            disabled={!isEditing}
                        />
                    </div>
                </div>

                {isEditing && (
                    <>
                    {formError !== "" ? (
                            <>
                            <p className="error-message">{formError}</p>
                            </>

                        ) : 
                        (
                        <div className="form-actions">
                            <button type="submit" className="save-btn" disabled={isLoadingPage}>
                                {isLoadingPage ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    )}
                    </>
                    //setPasswordFormError
                )}
            </form>

            {/* Password Change Section */}
            <div className="password-section">
                <div className="form-header">
                    <h2>Password</h2>
                    {!isEditing && (
                    <button
                        type="button"
                        className="toggle-edit-btn"
                        onClick={togglePasswordChange}
                    >
                        {isChangingPassword ? 'Cancel' : 'Change Password'}
                    </button>
                    )}
                </div>

                {isChangingPassword && (
                    <form className="password-form" onSubmit={handlePasswordSubmit}>
                        {passwordError && <div className="error-message">{passwordError}</div>}

                        <div className="form-group">
                            <label htmlFor="current_password">Current Password</label>
                            <input
                                type="password"
                                id="current_password"
                                name="current_password"
                                value={passwordData.current_password}
                                onChange={handlePasswordChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="new_password">New Password</label>
                            <input
                                type="password"
                                id="new_password"
                                name="new_password"
                                value={passwordData.new_password}
                                onChange={handlePasswordChange}
                                required
                                minLength="8"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirm_password">Confirm New Password</label>
                            <input
                                type="password"
                                id="confirm_password"
                                name="confirm_password"
                                value={passwordData.confirm_password}
                                onChange={handlePasswordChange}
                                required
                            />
                        </div>

                        <div className="password-requirements">
                            <p>Password must be at least 8 characters long</p>
                        </div>

                        
                        {passwordFormError !== "" ? (
                                <>
                                <p className="error-message">{passwordFormError}</p>
                                </>

                            ) : 
                            (
                            <div className="form-actions">
                                <button type="submit" className="save-btn" disabled={isLoadingPage}>
                                    {isLoadingPage ? 'Updating...' : 'Update Password'}
                                </button>
                            </div>
                        )}
                        
                    </form>
                    
                )}
            </div>
            {!isChangingPassword && !isEditing && (
            <button className="delete-button"  onClick={() => (setStep(2))}>
                Delete Account
            </button>
            )}
        </div>
        )}
        


        {step === 2 && (
            <div /*center this */>
            
                <>
                <div>
                    <h2>Are you sure you want to DELETE your account</h2>
                    <div /*make these buttons side by side*/>
                        <button className="delete-button" onClick={() => confirmDeletion()}>Confirm Deletion</button>
                        <button className="attraction-button" onClick={() => cancelDeletion()}>Cancel Deletion</button>
                    </div>
                </div>
                </>
            
            </div>
        )}
        </>
        
    );
}

export default Account;