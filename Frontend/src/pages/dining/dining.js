import React from "react";
import "../../App.css";
import "./dining.css";

import heroImage from "../../assets/dining_page_image.jpg";
import sweetsImage from "../../assets/dining_page_sweets.jpg";
import grillImage from "../../assets/dining_page_grill.jpg";
import mexicanImage from "../../assets/dining_page_mexican.jpg";
import ticketImage from "../../assets/dining_page_food_pass.jpg";

function Dining() {
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
          {foodStands.map((stand, index) => (
            <div className="food-stand-card" key={index}>
              <div
                className="food-stand-image"
                style={{
                  backgroundImage: `url(${stand.image})`
                }}
              >
                <div className="image-overlay">
                  <div className="image-text">{stand.name}</div>
                </div>
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