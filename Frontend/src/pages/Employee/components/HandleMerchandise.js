import React, { useEffect, useState, useRef } from "react";
import "../../../App.css";


const HandleMerchandise = ({ setActiveTab }) => {
    const alertShown = useRef(false);
    const [merchandises, setMerchandises] = useState([]);
    const [refreshMerchandise, setRefreshMerchandise] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newStockAmount, setNewStockAmount] = useState("");
    const [newPrice, setNewPrice] = useState("");



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
                //setEmployees(data.data);
                const merch = data.data.map((item,index) => {
                    return {
                        ...item,
                        is_editing_stock : false,
                        is_editing_price : false
                    };
                });

                setMerchandises(merch);
                console.log(merch);

                //console.log(merch);
                
            }
            } catch (error) {
            console.error('Error fetching merchandise:', error);
            }
        };

        fetchMerchandise();
        
    }, [refreshMerchandise]);

    const EditMerchandiseStock = (merchandise_id) => {
        setIsEditing(true);
        const newMerchandise = merchandises.map(item => {
            if (item.merchandise_id === merchandise_id)
            {
                item.is_editing_stock = true;
            }
            return item;
        });
        setMerchandises(newMerchandise);
    };

    const cancelEditMerchandiseStock = (merchandise_id) => {
        setIsEditing(false);
        setNewStockAmount("");
        const newMerchandise = merchandises.map(item => {
            if (item.merchandise_id === merchandise_id)
            {
                item.is_editing_stock = false;
            }
            return item;
        });
        setMerchandises(newMerchandise);
    };

    const submitEditMerchandiseStock = async (merchandise_id) => {
        try {
            const dataToSend = {
                id : merchandise_id,
                newStock : Number(newStockAmount)
            }
            const response = await fetch('http://localhost:4000/updateMerchandiseStock', {
            method: 'POST',
            credentials: 'include',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend),
        });
        
        if (!response.ok) {
            throw new Error('Failed to update merchandise');
        }
        
        setIsEditing(false);
        setNewStockAmount("");
        /*
        const newMerchandise = merchandises.map(item => {
            if (item.merchandise_id === merchandise_id)
            {
                item.is_editing_stock = false;
            }
            return item;
        });
        setMerchandises(newMerchandise);*/
        setRefreshMerchandise(!refreshMerchandise);

        } catch (error) {
            console.error('Error fetching merchandise:', error);
            alertShown.current = true;
            alert("Error updating merchandise");
        }
        

    }

    const EditMerchandisePrice = (merchandise_id) => {
        setIsEditing(true);
        const newMerchandise = merchandises.map(item => {
            if (item.merchandise_id === merchandise_id)
            {
                item.is_editing_price = true;
            }
            return item;
        });
        setMerchandises(newMerchandise);
    };

    const cancelEditMerchandisePrice = (merchandise_id) => {
        setIsEditing(false);
        setNewPrice("");
        const newMerchandise = merchandises.map(item => {
            if (item.merchandise_id === merchandise_id)
            {
                item.is_editing_price = false;
            }
            return item;
        });
        setMerchandises(newMerchandise);
    };

    const submitEditMerchandisePrice = async (merchandise_id) => {
        try {
            const dataToSend = {
                id : merchandise_id,
                newPrice : Number(newPrice)
            }
            const response = await fetch('http://localhost:4000/updateMerchandisePrice', {
            method: 'POST',
            credentials: 'include',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend),
        });
        
        if (!response.ok) {
            throw new Error('Failed to update merchandise');
        }
        
        setIsEditing(false);
        setNewPrice("");
        /*
        const newMerchandise = merchandises.map(item => {
            if (item.merchandise_id === merchandise_id)
            {
                item.is_editing_stock = false;
            }
            return item;
        });
        setMerchandises(newMerchandise);*/
        setRefreshMerchandise(!refreshMerchandise);

        } catch (error) {
            console.error('Error fetching merchandise:', error);
            alertShown.current = true;
            alert("Error updating merchandise");
        }
        

    }



  return (
    <div className="profile-container">
      <h2>Online Store Merchandise</h2>
      <p>View and update your merchandise information here.</p>
      <div className="attractions-grid">
            {merchandises.map((Merchandise) => (
                <div className="attraction-card" key={Merchandise.merchandise_id}>
                    <div className="attraction-image-container">
                       {/*} <div className="attraction-image" style={{ backgroundImage: `url(${Merchandise.image})` }}></div> */}
                    </div>
                    <div className="attraction-content">
                        <h2 className="attraction-name">{Merchandise.merchandise_name}</h2>
                        <p className="attraction-description">${Merchandise.merchandise_price} USD</p>
                        <div className="attraction-details">
                            <span className="attraction-detail">
                                
                                <><strong>Stock Amount:</strong> {Merchandise.stock_amount}</>
                                
                            </span>
                            <span className="attraction-detail">
                             {/*}   {Merchandise.in_shopping_cart > 0 && (
                                    <><strong>Amount In Shopping Cart:</strong> {Merchandise.in_shopping_cart}</>
                                )}*/}
                            </span>
                        </div>

                        <div className="attraction-footer">
                            {!isEditing && (
                            <button className="attraction-button" onClick={() => EditMerchandiseStock(Merchandise.merchandise_id)}>
                                Update Stock Amount
                            </button>
                            )}
                            {Merchandise.is_editing_stock && (
                                <>
                                <label className="label-header"> Set Stock Amount </label>
                                <input
                                type="text"
                                value={newStockAmount}
                                onChange={(e) => {
                                    let value = e.target.value.replace(/\D/g, ""); 
                                    setNewStockAmount(value);
                                    //setCardHolder(onlyLetters);
                                    //checkError();
                                }}   
                                placeholder="Stock Amount"
                                maxLength="3"
                                minLength="3"
                                required
                                />
                                {newStockAmount.length > 0 && (
                                    <button className="attraction-button" onClick={() => submitEditMerchandiseStock(Merchandise.merchandise_id)}>
                                        Confirm Changes
                                    </button>
                                )}
                                <button className="attraction-button" onClick={() => cancelEditMerchandiseStock(Merchandise.merchandise_id) }>
                                    Cancel Changes
                                </button>
                                </>
                            )}
                        </div>

                        <div className="attraction-footer">
                            {!isEditing && (
                            <button className="attraction-button" onClick={() => EditMerchandisePrice(Merchandise.merchandise_id)}>
                                Update Price
                            </button>
                            )}
                            {Merchandise.is_editing_price && (
                                <>
                                <label className="label-header"> Set Price </label>
                                <input
                                type="text"
                                value={newPrice}
                                onChange={(e) => {
                                    let value = e.target.value.replace(/\D/g, ""); 
                                    setNewPrice(value);
                                    //setCardHolder(onlyLetters);
                                    //checkError();
                                }}   
                                placeholder="Price"
                                maxLength="3"
                                minLength="3"
                                required
                                />
                                {newPrice.length > 0 && (
                                    <button className="attraction-button" onClick={() => submitEditMerchandisePrice(Merchandise.merchandise_id)}>
                                        Confirm Changes
                                    </button>
                                )}
                                <button className="attraction-button" onClick={() => cancelEditMerchandisePrice(Merchandise.merchandise_id) }>
                                    Cancel Changes
                                </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
      {/*<button onClick={() => setActiveTab('dashboard')}>Back to Dashboard</button>*/}
    </div>
  );
};

export default HandleMerchandise;
