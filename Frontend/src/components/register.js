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
        address: {
            street: "",
            city: "",
            state: "",
            zip: "",
        }
    });

    return (
        <>
        <div /*background*/>
        <div /*centralized Register container*/>
            <h1 /*title*/> Register </h1>
            <form /*onSubmit = {handleSubmit}*/ /*form area*/>
                <div /*row*/ >
                    <div /*input Group*/>
                        <input 
                            type="text"
                            //clasName = ""
                            placeholder = "First Name"
                            value={formData.first_name}
                            onChange = {(e) => setFormData({ ...formData, first_name: e.target.value})}
                            maxLength="50"
                            minLength="1"
                            pattern= "[^0-9]+" // \w* stands for all word characters
                        />
                    </div>
                    <div /*input Group*/>
                        <input 
                            type="text"
                            //clasName = ""
                            placeholder = "Last Name"
                            value={formData.last_name}
                            onChange = {(e) => setFormData({ ...formData, last_name: e.target.value})}
                            maxLength="50"
                            minLength="1"
                            pattern= "[^0-9]+" // \w* stands for all word characters
                        />
                    </div>
                </div>
                <div /*row*/ >
                </div>
            </form>
        </div>
        </div>
        </>
    )
}

export default Register