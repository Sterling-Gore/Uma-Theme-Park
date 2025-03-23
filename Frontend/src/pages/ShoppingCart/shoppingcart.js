import React, { useEffect, useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
// import "../../App.css";
import "./shoppingcart.css"

function Shoppingcart()
{
    const navigate = useNavigate();
    const { isLoggedIn, userType, isLoading } = useContext(AuthContext);
    const alertShown = useRef(false);
    const [cartItemsTickets, setCartItemsTickets] = useState([]);
    const [cartItemsMerchs, setCartItemsMerchs] = useState([]);
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

    const [refreshMerchandise, setRefreshMerchandise] = useState(false);



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
        initializeCart();
        
    }, [refreshMerchandise]);

    useEffect(() => {
        checkError();
    }, [card])

    useEffect(() => {
        CalculateTotalPrice(cartItemsTickets, cartItemsMerchs);
    }, [cartItemsTickets, cartItemsMerchs]);


    //useEffect(() => {CalculateTotalPrice();}, []);
 

    // Only render content after loading and redirects are done
    if (isLoading || userType === "employee" || userType === "manager") {
        return null;
    } 

    const fetchMerchandise = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/getMerchandise`, {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
          if (!response.ok) {
            throw new Error('Failed to fetch merchandise');
          }
          
          const data = await response.json();
          if (data.success) {
              return data.data;
            //setEmployees(data.data);
              
          }
        } catch (error) {
          console.error('Error fetching merchandise:', error);
        }
    };

    const fetchMerchStockAmount = async (item_id) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/getMerchandiseStockQuantity`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "merchandise_id": item_id }),
              });
          if (!response.ok) {
            throw new Error("Error fetching Stock Quanity");
          }
          const data = await response.json();
          return data.stock_amount;
        } catch (error) {
          console.error("Error fetching Stock Qunatity:", error);
          return 0;
        }
    };

    const postPurchase = async (dataToSend) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/purchaseTicketsAndMerch`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify( dataToSend ),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error("Error Posting Purchase");
                
            }
            return true;

        } catch (error) {
          console.error("Error Posting purchase:", error);
          return false;
        }
    };
    
    const initializeCart = async () => {
        const storedCartTickets = JSON.parse(localStorage.getItem("cart-tickets")) || [];
        //this is used to add an id to each ticket in the shopping cart
        const storedCartTicketsWithID = storedCartTickets.map((item, index) => {
            return{
            ...item,
            id:  `${index}`
            };
        });
        console.log(storedCartTicketsWithID);

        //const storedCartMerchs = JSON.parse(localStorage.getItem("cart-merchandise")) || [];
        

        setCartItemsTickets(storedCartTicketsWithID);
        //setCartItemsMerchs(storedCartMerchs);
        //CalculateTotalPrice(storedCartTicketsWithID, storedCartMerchs);

        const FetchedMerch = await fetchMerchandise();
        const merch = FetchedMerch.map(item => {
            return {
                ...item,
                in_shopping_cart: 0,
            };
        });
        const storedMerchInCart = JSON.parse(localStorage.getItem("cart-merchandise")) || [];
        const updatedMerch = merch.map(item => {
            const storedItem = storedMerchInCart.find(cartItem => cartItem.merchandise_id === item.merchandise_id);
            if (storedItem) {
                let newInCart = Number(storedItem.in_shopping_cart);
                let availableStock = Number(item.stock_amount);
    
                // Ensure in_shopping_cart does not exceed available stock
                if (newInCart > availableStock) {
                    newInCart = availableStock;
                }
    
                return {
                    ...item,
                    in_shopping_cart: newInCart,
                    stock_amount: availableStock - newInCart
                };
            }

            return item;
        }).filter(item => item.in_shopping_cart != 0);
        
        setCartItemsMerchs(updatedMerch);
        console.log(updatedMerch);

        //console.log(merch);
        
    };

    const CalculateTotalPrice = (storedCartTickets = null, storedCartMerchs = null) => {
        let accumulatedPrice = 0;
        if(storedCartTickets === null)
        {
            cartItemsTickets.map((item) => (
                accumulatedPrice += item.price
            ));
        }
        else
        {
            storedCartTickets.map((item) => (
                accumulatedPrice += item.price
            ));
        }

        if(storedCartMerchs === null)
        {
            cartItemsMerchs.map((item) => (
                accumulatedPrice += (item.merchandise_price * item.in_shopping_cart)
            ));
        }
        else
        {
            storedCartMerchs.map((item) => (
                accumulatedPrice += (item.merchandise_price * item.in_shopping_cart)
            ));
        }
        
        setTotalPrice(accumulatedPrice);
        
    };

    const DeleteTicket = (indexID) => {
        const updatedCart = cartItemsTickets.filter(item => item.id !== indexID);
        setCartItemsTickets(updatedCart);

        localStorage.setItem("cart-tickets", JSON.stringify(updatedCart));
        //CalculateTotalPrice(updatedCart, cartItemsMerchs);
        console.log(indexID);
    };

    const DeleteMerhandise = (indexID) => {
        const updatedCart = cartItemsMerchs.filter(item => item.merchandise_id !== indexID);
        setCartItemsMerchs(updatedCart);

        localStorage.setItem("cart-merchandise", JSON.stringify(updatedCart));
        //CalculateTotalPrice(cartItemsTickets, updatedCart);
        console.log(indexID);
    };

    const AddOneMerchandise = (indexID) => {
        const updatedCartItems = cartItemsMerchs.map((item) =>
            item.merchandise_id === indexID && item.stock_amount > 0
                ? { ...item, stock_amount: item.stock_amount - 1, in_shopping_cart: Number(item.in_shopping_cart) + 1 }
                : item
        );
        localStorage.setItem("cart-merchandise", JSON.stringify(updatedCartItems));
        setCartItemsMerchs(updatedCartItems);
        //CalculateTotalPrice(cartItemsTickets, updatedCartItems);
    };

    const RemoveOneMerchandise = (indexID) => {
        const updatedCartItems = cartItemsMerchs.map((item) =>
            item.merchandise_id === indexID && item.in_shopping_cart > 0
                ? { ...item, stock_amount: item.stock_amount + 1, in_shopping_cart: Number(item.in_shopping_cart) - 1 }
                : item
        );
        localStorage.setItem("cart-merchandise", JSON.stringify(updatedCartItems));
        setCartItemsMerchs(updatedCartItems);
        //CalculateTotalPrice(cartItemsTickets, updatedCartItems);
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


    const handleCheckout = async () => {
        try {
          for (const item of cartItemsMerchs) {
            const fetched_stock_amount = await fetchMerchStockAmount(item.merchandise_id);
            console.log(`Item ${item.merchandise_id}: Quantity in cart = ${item.in_shopping_cart}, Fetched quantity = ${fetched_stock_amount}`);
            if (item.in_shopping_cart > fetched_stock_amount) {
              alert(`ERROR: Quantity for ${item.merchandise_name} exceeds available quantity (${fetched_stock_amount})`);
              setRefreshMerchandise( !refreshMerchandise); 
              return false;
            }
          }
          setStep(2);
          return true;
          // Proceed with checkout logic here
        } catch (error) {
          console.error("Error during checkout:", error.message);
          return false;
        }
      };

    const handlePlaceOrder = async () => {
        console.log("PLEASE WORK");
        //give the data to backend
        const ableToPurchase = await handleCheckout();
        if(ableToPurchase)
        {
            try {
                const storedUserID = localStorage.getItem('userID');
                const dataToSend = {
                    Tickets: cartItemsTickets,
                    Merchandise: cartItemsMerchs,
                    userID: storedUserID
                };
                const successfulPurchase = await postPurchase(dataToSend);
                if(successfulPurchase)
                {
                    setStep(3);
                    //clear localstorage
                    localStorage.removeItem("cart-tickets", JSON.stringify([]));
                    localStorage.removeItem("cart-merchandise", JSON.stringify([]));
                    setCartItemsTickets([]);
                    setCartItemsMerchs([]);
                    return;
                }
                else
                {
                    throw new Error('Failed to handle purchase');
                }
                // Proceed with checkout logic here
              } catch (error) {
                alert("Error during purchase:", error.message);
                setStep(2);
              }
        }
        else
        {
            setStep(1);
        }
    
        
    };


    return (
        <div>
            {step === 1 && (
            <>
            <h1 className="page-title">Your Shopping Cart</h1>

                {cartItemsTickets.length > 0 || cartItemsMerchs.length > 0? (
                    <>
                    {cartItemsTickets.length > 0 && <h1 className="section-title">Tickets</h1>}
                    <div className="cart-items-container">
                        {cartItemsTickets.map((item, index) => (
                            <div key={index} className="cart-item">
                                <div className="cart-item-header">
                                    <button className="delete-btn" onClick={() => (DeleteTicket(item.id))}>Delete Ticket</button>
                                    <p className="ticket-type">{item.numOfDays}-Day Ticket</p>
                                </div>
                                <ul className="date-list">
                                    {item.selectedDates.map((date, index2) => (
                                        <li className="date-item" key={index2}>
                                            <span className="date-text">{date}</span> 
                                            {item.selectedDatesForFoodPass.includes(date) ? 
                                                <span className="food-pass-indicator">(Includes ${item.numOfStandardTickets*3 + item.numOfSeniorTickets*2 + item.numOfChildrenTickets} Food Pass)</span> : ''}
                                        </li>
                                    ))}
                                </ul>
                                <div className="ticket-summary-container">
                                    <div className="ticket-summary">
                                        <p className="ticket-detail">{item.numOfStandardTickets > 0 ? `${item.numOfStandardTickets} Standard Ticket${item.numOfStandardTickets > 1 ? 's' : ''} ($${item.numOfDays * 10} Per Ticket)` : ""}</p>
                                        <p className="ticket-price">{item.numOfStandardTickets > 0 ? `$${item.numOfDays * 10 * item.numOfStandardTickets}` : ""}</p>
                                    </div>
                                    <div className="ticket-summary">
                                        <p className="ticket-detail">{item.numOfChildrenTickets > 0 ? `${item.numOfChildrenTickets} Child Ticket${item.numOfChildrenTickets > 1 ? 's' : ''} ($${item.numOfDays * 6} Per Ticket)` : ""}</p>
                                        <p className="ticket-price">{item.numOfChildrenTickets > 0 ? `$${item.numOfDays * 6 * item.numOfChildrenTickets}` : ""}</p>
                                    </div>
                                    <div className="ticket-summary">
                                        <p className="ticket-detail">{item.numOfSeniorTickets > 0 ? `${item.numOfSeniorTickets} Senior Ticket${item.numOfSeniorTickets > 1 ? 's' : ''} ($${item.numOfDays * 4} Per Ticket)` : ""}</p>
                                        <p className="ticket-price">{item.numOfSeniorTickets > 0 ? `$${item.numOfDays * 4 * item.numOfSeniorTickets}` : ""}</p>
                                    </div>
                                    <div className="total-price">
                                        <p className="price-text">${item.price} USD</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {cartItemsMerchs.length > 0 && <h1 className="section-title">Merchandise</h1>}
                    <div className="cart-items-container">
                        {cartItemsMerchs.map((item, index) => (
                            <div key={index} className="cart-item merch-item">
                                <div className="cart-item-header">
                                    <button className="delete-btn" onClick={() => (DeleteMerhandise(item.merchandise_id))}>Remove Merchandise</button>
                                    <p className="merch-name">{item.in_shopping_cart}x {item.merchandise_name}{item.in_shopping_cart > 1 ? ('s') : ('')}</p>
                                </div>
                                <div className="merch-details">
                                    {item.stock_amount < 6 && <p className="low-stock">{item.stock_amount} Remaining</p>}
                                    <div className="quantity-controls">
                                        <button className="quantity-btn" onClick={() => AddOneMerchandise(item.merchandise_id)}>+</button>
                                        <button className="quantity-btn" onClick={() => RemoveOneMerchandise(item.merchandise_id)}>-</button>
                                    </div>
                                    <div className="total-price">
                                        <p className="price-text">${item.merchandise_price * item.in_shopping_cart} USD <span className="unit-price">(${item.merchandise_price} per item)</span></p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <p className="total-amount">${totalPrice} USD</p>
                        <button className="checkout-btn" onClick={() => handleCheckout()}>Checkout</button>
                    </div>
                    </>
                ) : (
                    <p className="empty-cart-message">No items in cart.</p>
                )}
            </>
            )}


            {step === 2 && (
                <div className="payment-container">
                    <button className="back-btn" onClick={() => setStep(1)}>Go Back</button>
                    <h1 className="page-title">Payment Information</h1>
                    <div className="payment-form">
                        <div className="form-group">
                            <label className="label-header">CARD NUMBER</label>
                            <input
                                className="payment-input"
                                type="text"
                                value={card.number}
                                onChange={ (e) => {
                                    let value = e.target.value.replace(/\D/g, ""); // Remove non-digits
                                    value = value.match(/.{1,4}/g)?.join(" ") || "";
                                    setCard({ ...card, number: value.slice(0, 19) });
                                }}   
                                placeholder="Card Number"
                                maxLength="19"
                                minLength="19"
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="label-header">EXPIRATION DATE</label>
                                <input
                                    className="payment-input"
                                    type="text"
                                    value={card.expiration_date}
                                    onChange={ (e) => {
                                        let value = e.target.value.replace(/\D/g, ""); // Remove non-digits
                                        value = value.match(/.{1,2}/g)?.join("/") || "";
                                        value = value.slice(0, 5);
                                        setCard({ ...card, expiration_date: value });
                                    }}   
                                    placeholder="MM/YY"
                                    maxLength="5"
                                    minLength="5"
                                />
                            </div>
                            <div className="form-group">
                                <label className="label-header">SECURITY CODE</label>
                                <input
                                    className="payment-input"
                                    type="text"
                                    value={card.security_code}
                                    onChange={(e) => {
                                        let value = e.target.value.replace(/\D/g, ""); 
                                        setCard({ ...card, security_code: value });
                                    }}   
                                    placeholder="CVV"
                                    maxLength="3"
                                    minLength="3"
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="label-header">CARD HOLDER</label>
                            <input
                                className="payment-input"
                                type="text"
                                value={card.holder_name}
                                onChange={(e) => {
                                    const onlyLettersAndSpaces = e.target.value.replace(/[^a-zA-Z\s]/g, ""); // Allow letters and spaces
                                    setCard({ ...card, holder_name: onlyLettersAndSpaces });
                                }}  
                                placeholder="Full Name"
                                maxLength="100"
                                minLength="1"
                            />
                        </div>
                        <div className="form-group">
                            <label className="label-header">CARD TYPE</label>
                            <select
                                className="payment-select"
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
                            <div className="form-actions">
                                <button
                                    className="place-order-btn"
                                    onClick={() => handlePlaceOrder()}
                                >
                                    Place Order
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="confirmation-container">
                    <h1 className="thank-you-title">Thank You For Your Purchase!</h1>
                    <a href='/' className="home-link">
                        <button className="home-btn">Back Home</button>
                    </a>
                </div>
            )}
        </div>
    );
}
export default Shoppingcart;