import React, { useEffect, useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../../context/AuthContext";
import './MerchandiseOrders.css';

function MerchandiseOrders() {
    const navigate = useNavigate();
    const { isLoggedIn, userType, isLoading } = useContext(AuthContext);
    const alertShown = useRef(false);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);



     // Redirect employees and managers to their portals
    useEffect(() => {
        if (!isLoading) {
            if (userType === "employee") {
                setLoading(false);
                navigate('/EmployeePortal');
            } else if (userType === "manager") {
                setLoading(false);
                navigate('/ManagerPortal');
            }
        }
    }, [userType, navigate, isLoading]);

    // Verify auth status for ticket purchase
    useEffect(() => {
        if (!isLoading && !isLoggedIn && !alertShown.current) {
            setLoading(false);
            alertShown.current = true;
            alert("Please login to view orders!");
            navigate("/login");
        }
    }, [isLoggedIn, navigate, isLoading]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);

                const userID = localStorage.getItem('userID');

                if (!userID) {
                    throw new Error('User ID not found. Please login again.');
                }


                const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/getMerchandiseOrders`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ customerID: userID }),
                });

                if (!response.ok) {
                    throw new Error(`Server responded with status: ${response.status}`);
                }

                const data = await response.json();

                if (!data.success && data.error) {
                    throw new Error(data.message || 'Failed to fetch orders');
                }

                setOrders(data.receipts || []);
                console.log(data.receipts);
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);


    

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          timeZone: 'UTC',
          year: 'numeric',
          month: 'short',
          day: 'numeric'
    
        });
      };


    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null) return 'N/A';

        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };


    // Only render content after loading and redirects are done
    if (isLoading || userType === "employee" || userType === "manager") {
        return <></>;
    }

    if (loading) {
        return (
            <div className="merchandise-orders loading">
                <h2>Orders</h2>
                <div className="loading-spinner">Loading your orders...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="merchandise-orders error">
                <div className="navigation-buttons">
                    <button
                        className="nav-btn"
                        onClick={() => window.location.href = '/account'}
                    >
                        Back to My Account
                    </button>
                </div>
                <h2>Orders</h2>
                <div className="error-message">
                    <p>Error loading orders: {error}</p>
                    <button onClick={() => window.location.reload()}>Try Again</button>
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <>
            <div className="navigation-buttons">
            <button
                className="nav-btn"
                onClick={() => window.location.href = '/account'}
            >
                Back to My Account
            </button>
            </div>
            <div className="merchandise-orders empty">
                <h2>Orders</h2>
                <p>You haven't placed any orders yet.</p>
            </div>
            </>
        );
    }

    return (
        <div className="merchandise-orders">
            <div className="navigation-buttons">
            <button
                className="nav-btn"
                onClick={() => window.location.href = '/account'}
            >
                Back to My Account
            </button>
            </div>
            <h2>Your Merchandise Orders</h2>

            <div className="orders-list">
                {orders.map((receipt, index) => (
                    <div key={receipt.receipt_id || `order-${index}`} className="order-card">
                        <div className="order-header">
                        
                            <h2>Receipt ID: {receipt.head_receipt_id}</h2>
                            <span className="order-cost">${Number(receipt.total_cost).toFixed(2)}</span>
                        
                            
                        </div>
                        
                        <div className="order-details">
                            <p><strong>Purchase Date:</strong> {formatDate(receipt.purchase_date)}</p>
                            

                            <div className="detail-row">
                                <p><strong>Items Purchased:</strong></p>
                            </div>
                                {Object.entries(receipt.merchandise_summary).map( ([name, array]) => (
                                    <div className="detail-row">
                                    <li key={name}>
                                        
                                        <span className="value">{array[0]}x {name}   <span className="small-order-cost">${Number(array[1]).toFixed(2)}</span></span>
                                        
                                    
                                    </li>
                                    </div>
                                    
                                    
                                ))}
                                
                                
                            
                        </div>

                        {/* <div className="order-actions">
                            <button className="view-details-btn">View Details</button>
                        </div> */}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MerchandiseOrders;