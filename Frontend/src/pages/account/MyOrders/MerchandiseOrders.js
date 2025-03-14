import React, { useState, useEffect } from 'react';
import './MerchandiseOrders.css'; // You can create this file for styling

function MerchandiseOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Get userID from localStorage
        const userID = localStorage.getItem('userID');
        
        if (!userID) {
          throw new Error('User ID not found. Please login again.');
        }

        // Fetch merchandise orders
        const response = await fetch('http://localhost:4000/getMerchandiseOrders', {
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
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Helper function to format currency
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return 'N/A';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (isLoading) {
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
      <div className="merchandise-orders empty">
        <h2>Orders</h2>
        <p>You haven't placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="merchandise-orders">
      <h2>Your Merchandise Orders</h2>
      
      <div className="orders-list">
        {orders.map((receipt, index) => (
          <div key={receipt.id || `order-${index}`} className="order-card">
            <div className="order-header">
              <h3>Receipt #{receipt.id}</h3>
              <span className="order-date">
                {formatDate(receipt.payment_date)}
              </span>
            </div>
            
            <div className="order-details">
              <div className="detail-row">
                <span className="label">Order ID:</span>
                <span className="value">{receipt.order_id}</span>
              </div>
              
              <div className="detail-row">
                <span className="label">Total Amount:</span>
                <span className="value">{formatCurrency(receipt.total_amount)}</span>
              </div>
              
              {receipt.payment_method && (
                <div className="detail-row">
                  <span className="label">Payment Method:</span>
                  <span className="value">{receipt.payment_method}</span>
                </div>
              )}
              
              {receipt.status && (
                <div className="detail-row">
                  <span className="label">Status:</span>
                  <span className={`value status-${receipt.status.toLowerCase()}`}>
                    {receipt.status}
                  </span>
                </div>
              )}
            </div>
            
            <div className="order-actions">
              <button className="view-details-btn">View Details</button>
              {receipt.status === 'Delivered' && (
                <button className="review-btn">Write a Review</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MerchandiseOrders;