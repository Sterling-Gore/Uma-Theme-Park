import React, { useEffect, useContext, useRef, useState } from "react";
import AuthContext from "../../context/AuthContext";
import "../../App.css";
import { useNavigate } from 'react-router-dom';


// Import images directly
import thunderMountain from "../../assets/thunderMountain.jpg";
// For the other images, make sure they exist in your assets folder
// If they don't exist yet, you'll need to add them
import enchantedCastle from "../../assets/thunderMountain.jpg";
import splashRapids from "../../assets/thunderMountain.jpg";
import skyFlyer from "../../assets/thunderMountain.jpg";

function Shop()
{
    const navigate = useNavigate();
    const { isLoggedIn, userType, isLoading } = useContext(AuthContext);
    const alertShown = useRef(false);

    const [merchandises, setMerchandises] = useState([]);


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
                alert("Please login to purchase merchandise!");
                navigate("/login");
            }
        }, [isLoggedIn, navigate, isLoading]);


        useEffect(() => {
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
                    console.log(data.data);
                  //setEmployees(data.data);
                }
              } catch (error) {
                console.error('Error fetching merchandise:', error);
              }
            };
            
            fetchMerchandise();
          }, []);

        useEffect(() => {
            //pull from database to get the merchandise
            //here's an example
            const merch = [
                {
                    id: 1,
                    name: "Princess Plushie",
                    price: 12,
                    stock: 36,
                    in_shopping_cart: 0,
                    image: thunderMountain
                },
                {
                    id: 2,
                    name: "Pirate Pete T-Shirt",
                    price: 15,
                    stock: 3,
                    in_shopping_cart: 0,
                    image: enchantedCastle
                },
                {
                    id: 3,
                    name: "Wacky Wizard Mug",
                    price: 6,
                    stock: 12,
                    in_shopping_cart: 0,
                    image: splashRapids
                },
                {
                    id: 4,
                    name: "Thunder Mountain Model Train Cart",
                    price: 35,
                    stock: 2,
                    in_shopping_cart: 0,
                    image: skyFlyer
                }
            ];
            const storedMerchInCart = JSON.parse(localStorage.getItem("cart-merchandise")) || [];
            const updatedMerch = merch.map(item => {
                const storedItem = storedMerchInCart.find(cartItem => cartItem.id === item.id);
                if (storedItem) {
                    let newInCart = Number(storedItem.in_shopping_cart);
                    let availableStock = Number(item.stock);
        
                    // Ensure in_shopping_cart does not exceed available stock
                    if (newInCart > availableStock) {
                        newInCart = availableStock;
                    }
        
                    return {
                        ...item,
                        in_shopping_cart: newInCart,
                        stock: availableStock - newInCart
                    };
                }

                return item;
            });

            setMerchandises(updatedMerch);

            const updatedStorageMerch = updatedMerch.filter(item => item.in_shopping_cart != 0);
            localStorage.setItem("cart-merchandise", JSON.stringify(updatedStorageMerch));



                
        }, []);


        useEffect(() => {
            if(merchandises.length > 0)
            {
                const updatedStorageMerch = merchandises.filter(item => item.in_shopping_cart != 0);
                localStorage.setItem("cart-merchandise", JSON.stringify(updatedStorageMerch));
            }
            

        }, [merchandises]);

    
        // Only render content after loading and redirects are done
        if (isLoading || userType === "employee" || userType === "manager") {
            return null;
        }

        const addToCart = (merchandise_id) => {
            setMerchandises((prevMerch) =>
                prevMerch.map((item) =>
                    item.id === merchandise_id && item.stock > 0
                        ? {
                              ...item,
                              stock: item.stock - 1,
                              in_shopping_cart: Number(item.in_shopping_cart) + 1,
                          }
                        : item
                )
            );
        };
        
        const removeFromCart = (merchandise_id) => {
            setMerchandises((prevMerch) =>
                prevMerch.map((item) =>
                    item.id === merchandise_id && item.in_shopping_cart > 0
                        ? { ...item, stock: item.stock + 1, in_shopping_cart: Number(item.in_shopping_cart) - 1 }
                        : item
                )
            );
        };

    return (
        <div className="activities-background">
            <div className="activities-container">
                <h1 className="activities-title">Merchandise Store</h1>
                <p className="activities-intro">Explore our online store of fantastic merchandise from your favorites attractions!</p>
                
                <div className="attractions-grid">
                    {merchandises.map((Merchandise) => (
                        <div className="attraction-card" key={Merchandise.id}>
                            <div className="attraction-image-container">
                                <div className="attraction-image" style={{ backgroundImage: `url(${Merchandise.image})` }}></div>
                            </div>
                            <div className="attraction-content">
                                <h2 className="attraction-name">{Merchandise.name}</h2>
                                <p className="attraction-description">${Merchandise.price} USD</p>
                                <div className="attraction-details">
                                    <span className="attraction-detail">
                                        {Merchandise.stock < 6 && (
                                            <><strong>Remaining Stock:</strong> {Merchandise.stock}</>
                                        )}
                                        
                                    </span>
                                    <span className="attraction-detail">
                                        {Merchandise.in_shopping_cart > 0 && (
                                            <><strong>Amount In Shopping Cart:</strong> {Merchandise.in_shopping_cart}</>
                                        )}
                                    </span>
                                </div>
                                <div className="attraction-footer">
                                    <button className="attraction-button" onClick={() => addToCart(Merchandise.id)}>
                                        Add One To Cart
                                    </button>
                                    <button className="attraction-button" onClick={() => removeFromCart(Merchandise.id)}>
                                        Remove One From Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="attraction-button" onClick={() => navigate("/shopping-cart")}>
                    Go to Shopping Cart
                </button>
            </div>
        </div>
    );
}
export default Shop;