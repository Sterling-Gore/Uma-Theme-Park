import React, {useState, useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from "../context/AuthContext"; 

function Login() {
    const navigate = useNavigate();
    const { setIsLoggedIn } = useContext(AuthContext);
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const handleSubmit = async (event) => {
        event.preventDefault();
        const dataToSend = {
            username : email,
            password : password
        }
        try {
            const response = await fetch('http://localhost:4000/login', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials : 'include',
                body: JSON.stringify(dataToSend), 
            });
            const data = await response.json();
    
            if (response.ok) {
                console.log('Login Successful: ', data.message);
                localStorage.setItem("isLoggedIn", "true")
                setIsLoggedIn(true);
                alert('Login Successful');
                navigate('/');
            } else {
                console.error('Error loggin in: ', data.message);
                alert(`Error: ${data.message || 'Failed to login'}`);
            }
        } catch (error) {
            console.error('Request failed:', error);
            alert('An error occurred while logging in');
        }


    }

    return (
        <>
        <div /*background*/>
        <div /*centralized login container*/>
            <h1 /*title*/> Login </h1>
            <form onSubmit = {handleSubmit} /*form area*/>
                <div /*row*/ >
                    <div /*input Group*/>
                        <label /*label header*/ > EMAIL </label>
                        <input 
                            type="email"
                            //clasName = ""
                            placeholder = "Email"
                            value={email}
                            onChange = {(e) => setEmail(e.target.value)}
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
                            value={password}
                            onChange = {(e) => setPassword(e.target.value)}
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
                    Login
                    </button>
                ) }
            </form>
        </div>
        </div>
        </>
    )
}

export default Login