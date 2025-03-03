import React, {  useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";

function Tickets()
{
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const navigate = useNavigate(); 

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch("http://localhost:4000/protected", {
                    method: "GET",
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: "include", 
                });

                if (response.ok) {
                    console.log("user is still authenticated")
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                    console.log("user is no longer authenticated so rerouting to main page")
                    alert("Please login!");
                    navigate("/"); 
                }
            } catch (error) {
                console.error("Auth check failed:", error);
                setIsAuthenticated(false);
                navigate("/"); 
            }
        };

        checkAuth();
    }, [navigate]);

    return(
    <>
    <h1>tickets</h1>
    </>
    );
}
export default Tickets;