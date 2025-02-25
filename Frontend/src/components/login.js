import React, {useState, useEffect} from 'react';


function Login() {
    const [error, setError] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const handleSubmit = async (event) => {}

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
                            onChange = {(e) => setEmail({ email: e.target.value})}
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
                            onChange = {(e) => setPassword({password : e.target.value})}
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