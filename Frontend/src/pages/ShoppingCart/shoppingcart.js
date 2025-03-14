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
          const response = await fetch('http://localhost:4000/getMerchandise', {
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
            const response = await fetch('http://localhost:4000/getMerchandiseStockQuantity', {
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
            const response = await fetch('http://localhost:4000/purchaseTicketsAndMerch', {
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
        const storedCartTicketsWithID = storedCartTickets.map((item, index) => ({
            ...item,
            id:  `${index}`,
        }));

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
            <h1>Your Shopping Cart</h1>

                {cartItemsTickets.length > 0 || cartItemsMerchs.length > 0? (
                    <>
                    {cartItemsTickets.length > 0 && <h1>Tickets</h1>}
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




                    {cartItemsMerchs.length > 0 && <h1>Merchandise</h1>}
                    {cartItemsMerchs.map((item, index) => (
                        <div key={index}>
                        <li >
                            <button onClick={() => (DeleteMerhandise(item.merchandise_id))}> Remove Merchandise</button>
                            <p >{item.in_shopping_cart}x {item.merchandise_name}{item.in_shopping_cart > 1 ? ('s') : ('')}</p>
                            {item.stock_amount < 6 && <p>{item.stock_amount} Remaining</p>}
                            <button onClick={() => AddOneMerchandise(item.merchandise_id)}>+</button>
                            <button onClick={() => RemoveOneMerchandise(item.merchandise_id)}>-</button>
                            
                            <div  /*price*/>
                                <p >${item.merchandise_price * item.in_shopping_cart} USD (${item.merchandise_price} per item)</p>
                            </div>
                        </li>
                        </div>
                    ))}



                    <p> ${totalPrice} USD</p>
                    <button onClick={() => handleCheckout()}>Checkout</button>
                    </>
                ) : (
                    <p>No items in cart.</p>
                )}

        
        </>
        )}


        {step === 2 && (
            <>
            <button onClick={() => setStep(1)}>Go Back</button>
            <div  /*onSubmit={handlePlaceOrder}*/>
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
                                
                                className="register-button"
                                onClick={() => handlePlaceOrder()}
                            >
                            Place Order
                            </button>
                        )}
                        <button
                                
                                className="register-button"
                                onClick={() => handlePlaceOrder()}
                            >
                            Place Order
                            </button>

                    </div>
            
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