// Frontend/src/pages/Tickets/tickets.js

import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import AuthContext from "../../context/AuthContext";

function Tickets() {
    const navigate = useNavigate();
    const { isLoggedIn, userType, isLoading } = useContext(AuthContext);

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
        if (!isLoading && !isLoggedIn) {
            alert("Please login to purchase tickets!");
            navigate("/login");
        }
    }, [isLoggedIn, navigate, isLoading]);

    // Only render content after loading and redirects are done
    if (isLoading || userType === "employee" || userType === "manager") {
        return null;
    }

    return (
        <div className="tickets-container">
            <h1>Purchase Tickets</h1>
            <div className="ticket-selection">
                <h2>Select Your Ticket Type</h2>
                <div className="ticket-types">
                    <div className="ticket-option">
                        <h3>Day Pass</h3>
                        <p>Full access for one day</p>
                        <p className="price">$89.99</p>
                        <button>Add to Cart</button>
                    </div>
                    <div className="ticket-option">
                        <h3>Weekend Pass</h3>
                        <p>Full access for Saturday & Sunday</p>
                        <p className="price">$149.99</p>
                        <button>Add to Cart</button>
                    </div>
                    <div className="ticket-option">
                        <h3>Annual Pass</h3>
                        <p>Unlimited access for a year</p>
                        <p className="price">$499.99</p>
                        <button>Add to Cart</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Tickets;