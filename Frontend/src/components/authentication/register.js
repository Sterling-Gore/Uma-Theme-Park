import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './register.css';

function Register() {
    const [error, setError] = useState("");
    const [confirm_password, setConfirm_Password] = useState("");
    const navigate = useNavigate();

    const [formData, setFormData] = useState(
        {
        first_name: "",
        last_name: "",
        birthday: "",
        email: "",
        phone_number: "",
        password: "",
        street: "",
        city: "",
        state: "",
        zip: "",
        
    });

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
            if ( formData.first_name === "")
            {
                setError("Fill in First Name");
                return true;
            }
            if ( formData.last_name === "")
            {
                setError("Fill in Last Name");
                return true;
            }
            if ( formData.email === "")
            {
                setError("Fill in Email");
                return true;
            }
            if ( !validateEmail(formData.email))
            {
                setError("Must Enter a Valid Email");
                return true;
            }
            if ( formData.phone_number === "")
            {
                setError("Fill in Phone Number");
                return true;
            }
            if ( formData.phone_number.length < 10)
            {
                setError("Phone Number Must Have 10 Digits");
                return true;
            }
            if ( formData.birthday === "")
            {
                setError("Fill in Birthday");
                return true;
            }
            if (checkBirthdate(formData.birthday) < 13)
            {
                setError("Must be at least 13 years old")
                return true;
            }        
            if ( formData.street === "")
            {
                setError("Fill in Street Address");
                return true;
            }
            if ( formData.city === "")
            {
                setError("Fill in City");
                return true;
            }
            if ( formData.state === "")
            {
                setError("Fill in State");
                return true;
            }
            if ( formData.zip === "")
            {
                setError("Fill in Zipcode");
                return true;
            }
            if ( formData.zip.length < 5)
            {
                setError("Zipcode Must Have 5 Digits");
                return true;
            }
            if ( formData.password === "")
            {
                setError("Fill in Password");
                return true;
            }
            if ( formData.password.length < 8)
            {
                setError("Password Must be at Least 8 Characters Long");
                return true;
            }
            if ( confirm_password === "")
            {
                setError("Fill in Confirm Password");
                return true;
            }
            if ( confirm_password.length < 8)
            {
                setError("Confirm Password Must be at Least 8 Characters Long");
                return true;
            }
            if ( confirm_password !== formData.password)
            {
                setError("Confirm Password Must Match Password");
                return true;
            }
                
            
            setError("");
            return false;
        }
    
        useEffect(() => {
            checkError();
        }, [formData, confirm_password])


    const handleSubmit = async (event) => {
        event.preventDefault(); 
        try {
            const response = await fetch('http://localhost:4000/customer/createCustomer', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData), 
            });
            const data = await response.json();
    
            if (response.ok) {
                console.log('Customer created successfully:', data);
                alert('Customer created successfully');

                navigate('/login')

            } else {
                console.error('Error creating customer:', data);
                alert(`Error: ${data.message || 'Failed to create customer'}`);
            }
        } catch (error) {
            console.error('Request failed:', error);
            alert('An error occurred while creating the customer');
        }
    };
    

    return (
        <>
        <div className="register-background">
        <div className="register-container">
            <h1 className="register-title"> Register </h1>
            <form onSubmit={handleSubmit} className="register-form">
                <div className="form-row">
                    <div className="input-group">
                        <label className="label-header"> FIRST NAME </label>
                        <input 
                            type="text"
                            className="form-input"
                            placeholder="First Name"
                            value={formData.first_name}
                            onChange={(e) => {
                                const onlyLetters = e.target.value.replace(/[^a-zA-Z]/g, ""); // Remove non-alphabet characters
                                setFormData({ ...formData, first_name: onlyLetters });
                                //checkError();
                              }}     
                            required                       
                            maxLength="50"
                            minLength="1"
                            pattern="[^0-9]+" // \w* stands for all word characters
                        />
                    </div>
                    <div className="input-group">
                        <label className="label-header"> LAST NAME </label>
                        <input 
                            type="text"
                            className="form-input"
                            placeholder="Last Name"
                            value={formData.last_name}
                            onChange={(e) => {
                                const onlyLetters = e.target.value.replace(/[^a-zA-Z]/g, ""); // Remove non-alphabet characters
                                setFormData({ ...formData, last_name: onlyLetters });
                                //checkError();
                            }}   
                            required 
                            maxLength="50"
                            minLength="1"
                            pattern="[^0-9]+" // \w* stands for all word characters
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="input-group">
                        <label className="label-header"> EMAIL </label>
                        <input 
                            type="email"
                            className="form-input"
                            placeholder="Email"
                            value={formData.email}
                            onChange={(e) => {
                                setFormData({ ...formData, email: e.target.value});
                                //checkError();
                            }}
                            required
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="input-group">
                        <label className="label-header"> PHONE NUMBER </label>
                        <input 
                            type="tel"
                            className="form-input"
                            placeholder="Phone Number"
                            value={formData.phone_number}
                            onChange={(e) => {
                                const onlyDigits = e.target.value.replace(/\D/g, ""); // Remove non-digits
                                setFormData({ ...formData, phone_number: onlyDigits});
                                //checkError();
                            }}
                            required
                            maxLength={10}
                            minLength={10}
                            pattern="\d*"
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="input-group">
                        <label className="label-header"> DATE OF BIRTH </label>
                        <input 
                            type="date"
                            className="form-input"
                            placeholder="Date Of Birth"
                            value={formData.birthday}
                            onChange={(e) => {
                                setFormData({ ...formData, birthday: e.target.value});
                                //checkError();
                            }}
                            required
                            max={new Date().toISOString().split('T')[0]}
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="input-group">
                        <label className="label-header"> STREET ADDRESS </label>
                        <input 
                            type="text"
                            className="form-input"
                            placeholder="Street Address"
                            value={formData.street}
                            onChange={(e) => {
                                setFormData({ ...formData, street: e.target.value})
                                //checkError();
                            }}
                            required
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="input-group">
                        <label className="label-header"> CITY </label>
                        <input 
                            type="text"
                            className="form-input"
                            placeholder="City"
                            value={formData.city}
                            onChange={(e) => {
                                setFormData({ ...formData, city: e.target.value});
                                //checkError();
                            }}
                            required
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="input-group">
                        <label className="label-header"> STATE </label>
                        <select 
                            className="form-input"
                            value={formData.state}
                            onChange={(e) => {
                                setFormData({ ...formData, state: e.target.value });
                                //checkError();
                            }}
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
                    </div>
                    <div className="input-group">
                        <label className="label-header"> ZIPCODE </label>
                        <input 
                            type="text"
                            className="form-input"
                            placeholder="Zipcode"
                            value={formData.zip}
                            onChange={(e) => {
                                const onlyDigits = e.target.value.replace(/\D/g, ""); // Remove non-digits
                                setFormData({ ...formData, zip: onlyDigits});
                                //checkError();
                            }}
                            required
                            maxLength="5"
                            minLength="5"
                            pattern="\d*"
                            
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="input-group">
                        <label className="label-header"> PASSWORD </label>
                        <input 
                            type="password"
                            className="form-input"
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => {
                                setFormData({ ...formData, password: e.target.value});
                                //checkError();
                            }}
                            required
                            maxLength={30}
                            minLength={8}
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="input-group">
                        <label className="label-header"> CONFIRM PASSWORD </label>
                        <input 
                            type="password"
                            className="form-input"
                            placeholder="Confirm Password"
                            value={confirm_password}
                            onChange={(e) => {
                                setConfirm_Password(e.target.value);
                                //checkError();
                            }}
                            required
                            maxLength={30}
                            minLength={8}
                        />
                    </div>
                </div>
                {error !== "" ? (
                    <p className="error-message">{error}</p>
                ) : (
                    <button
                        type="submit"
                        className="register-button"
                    >
                    Create an Account
                    </button>
                )}
            </form>
            <div className="login-link">
                Already have an account? <a href="/login">Log in</a>
            </div>
        </div>
        </div>
        </>
    )
}

export default Register