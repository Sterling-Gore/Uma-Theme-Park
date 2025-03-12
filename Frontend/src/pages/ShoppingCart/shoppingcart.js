import React, { useEffect, useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import "../../App.css";

function Shoppingcart()
{
    const navigate = useNavigate();
    const { isLoggedIn, userType, isLoading } = useContext(AuthContext);
    const alertShown = useRef(false);
    const [cartItemsTickets, setCartItemsTickets] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const [step, setStep] = useState(1);
    const [error, setError] = useState("");
    const [card, setCard] = useState(
            {
            holder_name: "",
            number: "",
            expiration_date: "",
            security_code: "",
            type: "",
        });



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
            alert("Please login to access shopping cart!");
            navigate("/login");
        }
    }, [isLoggedIn, navigate, isLoading]);


    useEffect(() => {
        // Retrieve the cart data from localStorage
        //const storedCart = JSON.parse(localStorage.getItem("cart-tickets")) || [];
        //setCartItemsTickets(storedCart);

        initializeCart();
        
    }, []);

    useEffect(() => {
        checkError();
    }, [card])

    //useEffect(() => {CalculateTotalPrice();}, []);
 

    // Only render content after loading and redirects are done
    if (isLoading || userType === "employee" || userType === "manager") {
        return null;
    } 
    
    const initializeCart = () => {
        const storedCart = JSON.parse(localStorage.getItem("cart-tickets")) || [];
        const storedCartWithID = storedCart.map((item, index) => ({
            ...item,
            id:  `${index}`,
        }));

        setCartItemsTickets(storedCartWithID);
        CalculateTotalPrice(storedCartWithID);
    };

    const CalculateTotalPrice = (storedCart = null) => {
        let accumulatedPrice = 0;
        if(storedCart === null)
        {
            cartItemsTickets.map((item) => (
                accumulatedPrice += item.price
            ));
        }
        else
        {
            storedCart.map((item) => (
                accumulatedPrice += item.price
            ));
        }
        
        setTotalPrice(accumulatedPrice);
        
    };

    const DeleteTicket = (indexID) => {
        const updatedCart = cartItemsTickets.filter(item => item.id !== indexID);
        setCartItemsTickets(updatedCart);

        localStorage.setItem("cart-tickets", JSON.stringify(updatedCart));
        CalculateTotalPrice(updatedCart);
        console.log(indexID);
    };

    const isExpired = (dateString) => {
        const [month, year] = dateString.split("/").map(Number);
    
        // Convert 2-digit year to 4-digit (assuming 20xx)
        const fullYear = 2000 + year; 
    
        // Get the current month and year
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1; // getMonth() is 0-based
    
        // Check if expired
        return fullYear < currentYear || (fullYear === currentYear && month < currentMonth);
    };

    const invalidMonth = (dateString) => {
       
        const [month, year] = dateString.split("/");
    
        const validMonths = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
        if (validMonths.includes(month))
        {
            return false;
        }
        return true;
    
         };

    function checkError()
    {
        
        if(card.number === "")
        {
            setError("Enter in Card Number");
            return true;
        }
        if(card.number.length < 19)
        {
            setError("Enter in a Valid Card Number");
            return true;
        }
        if(card.expiration_date === "")
        {
            setError("Enter in Card Expiration Date");
            return true;
        }
        if(card.expiration_date.length < 5 || isExpired(card.expiration_date) || invalidMonth(card.expiration_date))
        {
            setError("Enter in a Valid Card Expiration Date");
            return true;
        }
        if(card.holder_name === "")
        {
            setError("Enter in Card Holder Name");
            return true;
        }
        if(card.security_code === "")
        {
            setError("Enter in Card Security Code");
            return true;
        }
        if(card.security_code.length !== 3 )
        {
            setError("Enter in a Valid Card Security Code");
            return true;
        }
        if(card.type === "")
        {
            setError("Enter in Card Type");
            return true;
        }
        setError("");
        return false;
    };



    const handlePlaceOrder = () => {
        //give the data to backend


        setStep(3);
        //clear localstorage
        localStorage.setItem("cart-tickets", JSON.stringify([]));
        setCartItemsTickets([]);
    };


    return (
        <div>
            {step === 1 && (
            <>
            <h1>Your Shopping Cart</h1>
            
            <h1>Tickets</h1>

                {cartItemsTickets.length > 0 ? (
                    <>
                    {cartItemsTickets.map((item, index) => (
                        <div key={index}>
                        <li >
                            <button onClick={() => (DeleteTicket(item.id))}> Delete Ticket</button>
                            <p >{item.numOfDays}-Day Ticket</p>
                            <ul >
                                {item.selectedDates.map((date, index2) => (
                                    <li key={index2}>{date} {item.selectedDatesForFoodPass.includes(date) ? `(Includes $${item.numOfStandardTickets*3 + item.numOfSeniorTickets*2 + item.numOfChildrenTickets} Food Pass)` : ''}</li>
                                ))}
                            </ul>
                            <div  className="ticket-summary">
                                <p >{item.numOfStandardTickets > 0 ? `${item.numOfStandardTickets} Standard Ticket${item.numOfStandardTickets > 1 ? 's' : ''} ($${item.numOfDays * 10} Per Ticket)` : ""}</p>
                                <p >{item.numOfStandardTickets > 0 ? `$${item.numOfDays * 10 * item.numOfStandardTickets}` : ""}</p>
                            </div>
                            <div  className="ticket-summary">
                                <p >{item.numOfChildrenTickets > 0 ? `${item.numOfChildrenTickets} Child Ticket${item.numOfChildrenTickets > 1 ? 's' : ''} ($${item.numOfDays * 6} Per Ticket)` : ""}</p>
                                <p >{item.numOfChildrenTickets > 0 ? `$${item.numOfDays * 6 * item.numOfChildrenTickets}` : ""}</p>
                            </div>
                            <div  className="ticket-summary">
                                <p >{item.numOfSeniorTickets > 0 ? `${item.numOfSeniorTickets} Senior Ticket${item.numOfSeniorTickets > 1 ? 's' : ''} ($${item.numOfDays * 4} Per Ticket)` : ""}</p>
                                <p >{item.numOfSeniorTickets > 0 ? `$${item.numOfDays * 4 * item.numOfSeniorTickets}` : ""}</p>
                            </div>
                            <div  /*price*/>
                                <p >${item.price} USD</p>
                            </div>
                        </li>
                        </div>
                    ))}
                    <p> {totalPrice} </p>
                    <button onClick={() => setStep(2)}>Checkout</button>
                    </>
                ) : (
                    <p>No items in cart.</p>
                )}

        
        </>
        )}


        {step === 2 && (
            <>
            <button onClick={() => setStep(1)}>Go Back</button>
            <form  onSubmit={handlePlaceOrder}>
                        <div>
                            <label className="label-header"> CARD NUMBER </label>
                            <input
                            type="text"
                            value={card.number}
                            onChange={ (e) => {
                                let value = e.target.value.replace(/\D/g, ""); // Remove non-digits
                                value = value.match(/.{1,4}/g)?.join(" ") || "";
                                setCard({ ...card, number: value.slice(0, 19) });
                                //setcard.number(value.slice(0, 19));
                                //checkError();
                            }}   
                            placeholder="Card Number"
                            maxLength="19"
                            minLength="19"
                            />
                        </div>
                        <div>
                            <label className="label-header"> CARD EXPIRATION DATE </label>
                            <input
                            type="text"
                            value={card.expiration_date}
                            onChange={ (e) => {
                                let value = e.target.value.replace(/\D/g, ""); // Remove non-digits
                                value = value.match(/.{1,2}/g)?.join("/") || "";
                                value = value.slice(0, 5);
                                setCard({ ...card, expiration_date: value });
                                //setcard.expiration_date(value);
                                //checkError();
                            }}   
                            placeholder="Expiration Date (MM/YY)"
                            maxLength="5"
                            minLength="5"
                            />
                        </div>
                        <div>
                            <label className="label-header"> CARD HOLDER </label>
                            <input
                            type="text"
                            value={card.holder_name}
                            onChange={(e) => {
                                const onlyLetters = e.target.value.replace(/[^a-zA-Z]/g, ""); // Remove non-alphabet characters
                                setCard({ ...card, holder_name: onlyLetters });
                                //setCardHolder(onlyLetters);
                                //checkError();
                            }}   
                            placeholder="Card Holder Name"
                            maxLength="100"
                            minLength="1"
                            />
                        </div>
                        <div>
                            <label className="label-header"> SECURITY CODE </label>
                            <input
                            type="text"
                            value={card.security_code}
                            onChange={(e) => {
                                let value = e.target.value.replace(/\D/g, ""); 
                                setCard({ ...card, security_code: value });
                                //setCardHolder(onlyLetters);
                                //checkError();
                            }}   
                            placeholder="Security Code"
                            maxLength="3"
                            minLength="3"
                            />
                        </div>
                        <div>
                            <select
                                value={card.type}
                                onChange={(e) => setCard({ ...card, type: e.target.value})}
                            >
                                <option value="">Select Card Type</option>
                                <option value="debit">Debit</option>
                                <option value="credit">Credit</option>
                            </select>
                        </div>
                        {error !== "" ? (
                            <p className="error-message">{error}</p>
                        ) : (
                            <button
                                type="submit"
                                className="register-button"
                            >
                            Place Order
                            </button>
                        )}

                    </form>
            
            </>
        )}

        {step === 3 && (
            <>
            <h1>Thank You For Your Purchase!</h1>

            <a href='/'>
                <button>Back Home</button>
            </a>
            </>
        )}
        </div>
    );
}
export default Shoppingcart;