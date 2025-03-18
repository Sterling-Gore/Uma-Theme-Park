import React, { useEffect, useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../../context/AuthContext";
import './MyOrders.css';

function MyOrders() {
    const navigate = useNavigate();
    const { isLoggedIn, userType, isLoading } = useContext(AuthContext);
    const alertShown = useRef(false);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


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
            alert("Please login to purchase tickets!");
            navigate("/login");
        }
    }, [isLoggedIn, navigate, isLoading]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const userId = localStorage.getItem('userID');

                if (!userId) {
                    setError('User not logged in. Please log in to view your orders.');
                    setLoading(false);
                    return;
                }

                const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/getTicketOrders`, {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ customer_id: userId }),
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const data = await response.json();


                if (data.success && data.data.length > 0) {
                    // Group orders by ticket_receipt_id
                    const groupedOrders = data.data.reduce((acc, order) => {
                        if (!acc[order.ticket_receipt_id]) {
                            acc[order.ticket_receipt_id] = {
                                receiptId: order.ticket_receipt_id,
                                customerName: order.first_name,
                                totalCost: order.total_cost,
                                numberOfDays: order.number_of_days,
                                numberOfStandards: order.number_of_standards,
                                numberOfChildren: order.number_of_children,
                                numberOfSeniors: order.number_of_seniors,
                                purchaseDate: new Date(order.purchase_date).toLocaleDateString(),
                                dates: []
                            };
                        }

                        acc[order.ticket_receipt_id].dates.push({
                            date: new Date(order.ticket_date).toLocaleDateString(),
                            includesFoodPass: order.includes_food_pass === 1 ? 'Yes' : 'No'
                        });

                        return acc;
                    }, {});

                    setOrders(Object.values(groupedOrders));
                } else {
                    setOrders([]);
                }

                setLoading(false);
            } catch (err) {
                setError('Failed to fetch orders. Please try again later.');
                setLoading(false);
                console.error('Error fetching orders:', err);
            }
        };

        fetchOrders();
    }, []);

    // Only render content after loading and redirects are done
    if (isLoading || userType === "employee" || userType === "manager") {
        return null;
    }

    if (loading) {
        return <div className="loading-container">Loading your orders...</div>;
    }

    if (error) {
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
        <div className="error-container">
            {error}
        </div>
        </>);
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
        <div className="empty-orders">
            You have no ticket orders yet.
        </div>
        </>
    );}

    return (
        <div className="my-orders-container">
            <div className="navigation-buttons">
                <button
                    className="nav-btn"
                    onClick={() => window.location.href = '/account'}
                >
                    Back to My Account
                </button>
            </div>
            <h1>My Ticket Orders</h1>

            <div className="orders-list">
                {orders.map((order) => (
                    <div key={order.receiptId} className="order-card">
                        <div className="order-header">
                            <h2>Receipt ID: {order.receiptId}</h2>
                            <span className="order-cost">${order.totalCost.toFixed(2)}</span>
                        </div>

                        <div className="order-details">
                            <p><strong>Name:</strong> {order.customerName}</p>
                            <p><strong>Purchase Date:</strong> {order.purchaseDate}</p>
                            <p><strong>Number of Days:</strong> {order.numberOfDays}</p>

                            <div className="ticket-counts">
                                <h3>Ticket Breakdown:</h3>
                                <ul>
                                    <li><strong>Standard Tickets:</strong> {order.numberOfStandards}</li>
                                    <li><strong>Children Tickets:</strong> {order.numberOfChildren}</li>
                                    <li><strong>Senior Tickets:</strong> {order.numberOfSeniors}</li>
                                    <li><strong>Total Tickets:</strong> {order.numberOfStandards + order.numberOfChildren + order.numberOfSeniors}</li>
                                </ul>
                            </div>

                            <div className="dates-section">
                                <h3>Ticket Dates:</h3>
                                <table className="dates-table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Includes Food Pass</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.dates.map((dateInfo, index) => (
                                            <tr key={index}>
                                                <td>{dateInfo.date}</td>
                                                <td>{dateInfo.includesFoodPass}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MyOrders;