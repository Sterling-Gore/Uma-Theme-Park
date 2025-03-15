import React, { useEffect, useState } from "react";
import "../../../App.css";


const HandleMerchandise = ({ setActiveTab }) => {
    const [merchandises, setMerchandises] = useState([]);
    const [refreshMerchandise, setRefreshMerchandise] = useState(false);



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

                setMerchandises(data.data);
                console.log(data.data);

                //console.log(merch);
                
            }
            } catch (error) {
            console.error('Error fetching merchandise:', error);
            }
        };

        fetchMerchandise();
        
    }, [refreshMerchandise]);



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
                            <button className="attraction-button" /*onClick={() => addToCart(Merchandise.merchandise_id)}*/>
                                Update Stock Amount
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      <button onClick={() => setActiveTab('dashboard')}>Back to Dashboard</button>
    </div>
  );
};

export default HandleMerchandise;
