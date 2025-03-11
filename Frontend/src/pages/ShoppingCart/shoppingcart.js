import React, {  useState , useEffect } from "react";
import "../../App.css";

function Shoppingcart()
{
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        // Retrieve the cart data from localStorage
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartItems(storedCart);
    }, []);

    return (
        <div>
            <h1>Your Shopping Cart</h1>
            <ul>
                {cartItems.length > 0 ? (
                    cartItems.map((item, index) => (
                        <li key={index}>
                            <p>Standard Tickets: {item.numOfStandardTickets}</p>
                            <p>Children Tickets: {item.numOfChildrenTickets}</p>
                            <p>Senior Tickets: {item.numOfSeniorTickets}</p>
                            <p>Number of Days: {item.numOfDays}</p>
                            <p>Selected Dates: {item.selectedDates.join(", ")}</p>
                            <p>Selected Dates for Food Pass: {item.selectedDatesForFoodPass.join(", ")}</p>
                        </li>
                    ))
                ) : (
                    <p>No items in cart.</p>
                )}
            </ul>
        </div>
    );
}
export default Shoppingcart;