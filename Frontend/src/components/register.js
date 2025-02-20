import React, {useState, useEffect} from 'react';


function Register() {
    const [error, setError] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [formData, setFormData] = useState(
        {
        first_name: "",
        last_name: "",
        birthday: "",
        email: "",
        phone_number: "",
        //username: "",    //I dont think we need a username, we can use emails instead
        password: "",
        confirm_password: "",
        street: "",
        city: "",
        state: "",
        zip: "",
        
    });

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
        if ( formData.birthday === "")
        {
            setError("Fill in Birthday");
            return true;
        }
        //if (/*age is younger than 12*/)
        //{
        //    setError("Must be at least 13 years old")
        //}
        if ( formData.first_name === "")
        {
            setError("Enter a First Name");
            return true;
        }

        return false;
    }

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
        <div /*background*/>
        <div /*centralized Register container*/>
            <h1 /*title*/> Register </h1>
            <form onSubmit = {handleSubmit} /*form area*/>
                <div /*row*/ >
                    <div /*input Group*/>
                        <label /*label header*/ > FIRST NAME </label>
                        <input 
                            type="text"
                            //clasName = ""
                            placeholder = "First Name"
                            value={formData.first_name}
                            onChange={(e) => {
                                const onlyLetters = e.target.value.replace(/[^a-zA-Z]/g, ""); // Remove non-alphabet characters
                                setFormData({ ...formData, first_name: onlyLetters });
                              }}                            
                            //onChange = {(e) => setFormData({ ...formData, first_name: e.target.value})}
                            maxLength="50"
                            minLength="1"
                            pattern= "[^0-9]+" // \w* stands for all word characters
                        />
                    </div>
                    <div /*input Group*/>
                        <label /*label header*/ > LAST NAME </label>
                        <input 
                            type="text"
                            //clasName = ""
                            placeholder = "Last Name"
                            value={formData.last_name}
                            onChange={(e) => {
                                const onlyLetters = e.target.value.replace(/[^a-zA-Z]/g, ""); // Remove non-alphabet characters
                                setFormData({ ...formData, last_name: onlyLetters });
                            }}    
                            //onChange = {(e) => setFormData({ ...formData, last_name: e.target.value})}
                            maxLength="50"
                            minLength="1"
                            pattern= "[^0-9]+" // \w* stands for all word characters
                        />
                    </div>
                </div>
                <div /*row*/ >
                    <div /*input Group*/>
                        <label /*label header*/ > EMAIL </label>
                        <input 
                            type="email"
                            //clasName = ""
                            placeholder = "Email"
                            value={formData.email}
                            onChange = {(e) => setFormData({ ...formData, email: e.target.value})}
                        />
                    </div>
                </div>
                <div /*row*/ >
                    <div /*input Group*/>
                        <label /*label header*/ > PHONE NUMBER </label>
                        <input 
                            type="tel"
                            //clasName = ""
                            placeholder = "Phone Number"
                            value={formData.phone_number}
                            onChange = {(e) => {
                                const onlyDigits = e.target.value.replace(/\D/g, ""); // Remove non-digits
                                setFormData({ ...formData, phone_number: onlyDigits});
                            }}
                            maxLength={10}
                            minLength={10}
                            pattern="\d*"
                        />
                    </div>
                </div>
                <div /*row*/ >
                    <div /*input Group*/>
                        <label /*label header*/ > BIRTHDAY </label>
                        <input 
                            type="date"
                            //clasName = ""
                            placeholder = "Birthday"
                            value={formData.birthday}
                            onChange = {(e) => setFormData({ ...formData, birthday: e.target.value})}
                            max = {new Date().toISOString().split('T')[0]}
                        />
                    </div>
                </div>
                <div /*row*/ >
                    <div /*input Group*/>
                        <label /*label header*/ > STREET ADDRESS </label>
                        <input 
                            type="text"
                            //clasName = ""
                            placeholder = "Street Address"
                            value={formData.street}
                            onChange = {(e) => setFormData({ ...formData, street : e.target.value})}
                        />
                    </div>
                </div>
                <div /*row*/ >
                    <div /*input Group*/>
                        <label /*label header*/ > CITY </label>
                        <input 
                            type="text"
                            //clasName = ""
                            placeholder = "City"
                            value={formData.city}
                            onChange = {(e) => setFormData({ ...formData, city : e.target.value})}
                        />
                    </div>
                </div>
                <div /*row*/ >
                    <div /*input Group*/>
                        <label /*label header*/ > STATE </label>
                        <select 
                            value = {formData.state}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
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
                    <div /*input Group*/>
                        <label /*label header*/ > ZIPCODE </label>
                        <input 
                            type="text"
                            //clasName = ""
                            placeholder = "Zipcode"
                            value={formData.zip}
                            onChange = {(e) => {
                                const onlyDigits = e.target.value.replace(/\D/g, ""); // Remove non-digits
                                setFormData({ ...formData, zip : onlyDigits});
                            }}
                            maxLength="5"
                            minLength="5"
                            pattern="\d*"
                        />
                    </div>
                </div>
                <div /*row*/ >
                    <div /*input Group*/>
                        <label /*label header*/ > PASSWORD </label>
                        <input 
                            type="text"
                            //clasName = ""
                            placeholder = "Password"
                            value={formData.password}
                            onChange = {(e) => setFormData({ ...formData, password : e.target.value})}
                            maxLength={30}
                            minLength={8}
                        />
                    </div>
                </div>
                <div /*row*/ >
                    <div /*input Group*/>
                        <label /*label header*/ > CONFIRM PASSWORD </label>
                        <input 
                            type="text"
                            //clasName = ""
                            placeholder = "Confirm Password"
                            value={formData.confirm_password}
                            onChange = {(e) => setFormData({ ...formData, confirm_password : e.target.value})}
                            maxLength={30}
                            minLength={8}
                        />
                    </div>
                </div>
                {error !== "" ? (
                    <p /*classname*/>{error}</p>
                ) : (
                    <button
                        type="submit"
                        /*classname*/
                    >
                    create an account
                    </button>
                ) }
            </form>
        </div>
        </div>
        </>
    )
}

export default Register