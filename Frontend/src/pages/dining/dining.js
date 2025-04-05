import React, { useEffect, useState, useRef } from "react";
import "../../App.css";
import "./dining.css";

import heroImage from "../../assets/dining_page_image.jpg";
import sweetsImage from "../../assets/dining_page_sweets.jpg";
import grillImage from "../../assets/dining_page_grill.jpg";
import mexicanImage from "../../assets/dining_page_mexican.jpg";
import ticketImage from "../../assets/dining_page_food_pass.jpg";

function Dining() {
  const [dining, setDining] = useState([]);


  useEffect(() => {
        const fetchDining = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/getDining`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                    });
                if (!response.ok) {
                    throw new Error('Failed to fetch dining');
                }
                const result = await response.json();

                if (result.success) {
                    setDining(result.data);
                } else {
                    throw new Error(result.message || 'Failed to fetch dining');
                }
            } catch (error) {
                console.error('Error fetching dining:', error);
                //setError(error.message);
            } 
        };

        fetchDining();
    }, []);
  const foodStands = [
    {
      name: "Wonderland Treats",
      description: "Indulge in sweet delights with our specialty cotton candy, caramel apples, funnel cakes, and hand-dipped ice cream. Perfect for satisfying your sweet tooth while exploring the park!",
      image: sweetsImage
    },
    {
      name: "Adventure Grill",
      description: "Enjoy hearty classics like juicy burgers, loaded hot dogs, fresh fries, and crispy chicken tenders. Our flame-grilled specialties will fuel your exciting day of attractions!",
      image: grillImage
    },
    {
      name: "World Flavors Pavilion",
      description: "Experience global cuisine with our rotating menu featuring Mexican street tacos, Italian pizza, Asian stir-fry, and more. A culinary journey that brings international flavors to your park experience!",
      image: mexicanImage
    }
  ];


  const getStatusClass = (status) => {
      switch (status) {
          case 'Closed':
              return 'dining-closed';
              break;
          case 'Maintenance':
              return 'status-maintenance';
              break;
          case 'Open':
              return 'dining-open'; //default green
              break;
          default:
              return 'dining-open'; //default green
              break;
      }
  };

  return (
    <div className="dining-container">
      <div
        className="dining-hero"
        style={{
          backgroundImage: `url(${heroImage})`
        }}
      >
        <div className="hero-content">
          <h1>Park Dining</h1>
          <p className="dining-subtitle">Delicious food to fuel your adventure</p>
        </div>
      </div>

      <section className="food-stands-section">
        <h2>Food Stands</h2>
        <div className="food-stands-container">
          {dining.map((stand, index) => (
            <div className="food-stand-card" key={index}>
              <div className="dining-space-between-container">
                <div>
                    <div
                      className="food-stand-image"
                      style={{
                        backgroundImage: `url(data:${stand.mimeType};base64,${stand.viewing_image})`,
                      }}
                    >
                      <div className="image-overlay">
                        <div className="image-text">{stand.dining_name}</div>
                      </div>
                    </div>
                    <div className="food-stand-info">
                      <h3>{stand.dining_name}</h3>
                      <p>{stand.dining_description}</p>
                      
                    </div>
                </div>
                <div>
                    <div className="food-stand-info">
                      <span className={`dining-status ${getStatusClass(stand.dining_status)}`}>
                          {stand.dining_status.charAt(0).toUpperCase() + stand.dining_status.slice(1)}
                      </span>
                    </div>
                </div>
            
              

              
              </div>
            </div>
            
          ))}
        </div>
      </section>

      <section className="food-pass-section">
        <div className="food-pass-container">
          <div className="food-pass-info">
            <h2>All-Day Dining Pass</h2>
            <p className="food-pass-price">$5.99 per person</p>
            <p className="food-pass-description">
              Enjoy unlimited dining at select food stands throughout the park! Our All-Day Dining Pass gives you access to a main meal, side, and drink every 90 minutes at participating locations. Perfect for families and anyone planning to spend the whole day experiencing our attractions.
            </p>
            <p className="food-pass-note">
              <strong>Note:</strong> Specialty desserts, alcoholic beverages, and premium menu items may require additional purchase.
            </p>
            <a href="/tickets" className="buy-tickets-button">Buy Tickets</a>
          </div>
          <div
            className="food-pass-image"
            style={{
              backgroundImage: `url(${ticketImage})`
            }}
          >
            <div className="image-overlay">
              
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dining;