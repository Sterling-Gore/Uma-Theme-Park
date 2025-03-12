import React, { useState, useEffect } from "react";
import "../../App.css";
import "./dining.css";

function Dining() {
  const foodStands = [
    {
      name: "Wonderland Treats",
      description: "Indulge in sweet delights with our specialty cotton candy, caramel apples, funnel cakes, and hand-dipped ice cream. Perfect for satisfying your sweet tooth while exploring the park!",
      image: "../../assets/sweet-treats.jpg" 
    },
    {
      name: "Adventure Grill",
      description: "Enjoy hearty classics like juicy burgers, loaded hot dogs, fresh fries, and crispy chicken tenders. Our flame-grilled specialties will fuel your exciting day of attractions!",
      image: "../../assets/burger-stand.jpg"
    },
    {
      name: "World Flavors Pavilion",
      description: "Experience global cuisine with our rotating menu featuring Mexican street tacos, Italian pizza, Asian stir-fry, and more. A culinary journey that brings international flavors to your park experience!",
      image: "../../assets/world-food.jpg"
    }
  ];

  return (
    <div className="dining-container">
      <div className="dining-hero">
        <h1>Park Dining</h1>
        <p className="dining-subtitle">Delicious food to fuel your adventure</p>
      </div>

      <section className="food-stands-section">
        <h2>Food Stands</h2>
        <div className="food-stands-container">
          {foodStands.map((stand, index) => (
            <div className="food-stand-card" key={index}>
              <div className="food-stand-image-placeholder">
                <div className="image-text">{stand.name}</div>
              </div>
              <div className="food-stand-info">
                <h3>{stand.name}</h3>
                <p>{stand.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="food-pass-section">
        <div className="food-pass-container">
          <div className="food-pass-info">
            <h2>All-Day Dining Pass</h2>
            <p className="food-pass-price">$6.99 per person</p>
            <p className="food-pass-description">
              Enjoy unlimited dining at select food stands throughout the park! Our All-Day Dining Pass gives you access to a main meal, side, and drink every 90 minutes at participating locations. Perfect for families and anyone planning to spend the whole day experiencing our attractions.
            </p>
            <p className="food-pass-note">
              <strong>Note:</strong> Specialty desserts, alcoholic beverages, and premium menu items may require additional purchase.
            </p>
            <a href="/tickets" className="buy-tickets-button">Buy Food Pass</a>
          </div>
          <div className="food-pass-image-placeholder">
            <div className="image-text">Food Pass</div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dining;