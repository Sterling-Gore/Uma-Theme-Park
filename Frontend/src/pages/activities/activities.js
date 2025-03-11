import React from "react";
import { useNavigate } from 'react-router-dom';
import "../../App.css";
import "./activities.css";

// Import images directly
import thunderMountain from "../../assets/thunderMountain.jpg";
// For the other images, make sure they exist in your assets folder
// If they don't exist yet, you'll need to add them
import enchantedCastle from "../../assets/thunderMountain.jpg";
import splashRapids from "../../assets/thunderMountain.jpg";
import skyFlyer from "../../assets/thunderMountain.jpg";

function Activities() {
    const navigate = useNavigate();

    const attractions = [
        {
            id: 1,
            name: "Thunder Mountain",
            description: "Experience the thrill of our premier roller coaster! Thunder Mountain takes you through twisting tracks at speeds up to 60 mph with breathtaking drops and heart-stopping loops.",
            minHeight: "48 inches",
            thrillLevel: "High",
            image: thunderMountain
        },
        {
            id: 2,
            name: "Enchanted Castle",
            description: "Step into a world of fantasy and wonder! Our Enchanted Castle features magical interactive experiences, charming characters, and a spectacular light show that will leave you spellbound.",
            minHeight: "None",
            thrillLevel: "Low",
            image: enchantedCastle
        },
        {
            id: 3,
            name: "Splash Rapids",
            description: "Beat the heat with our exhilarating water adventure! Splash Rapids sends you down rushing waters, through misty caves, and culminates in a jaw-dropping 40-foot plunge.",
            minHeight: "42 inches",
            thrillLevel: "Medium",
            image: splashRapids
        },
        {
            id: 4,
            name: "Sky Flyer",
            description: "Soar through the clouds on our newest attraction! Sky Flyer suspends you 200 feet in the air as you swing, spin, and fly like never before with panoramic views of the entire park.",
            minHeight: "52 inches",
            thrillLevel: "High",
            image: skyFlyer
        }
    ];

    return (
        <div className="activities-background">
            <div className="activities-container">
                <h1 className="activities-title">Park Attractions</h1>
                <p className="activities-intro">Discover the excitement and adventure waiting for you at our world-class attractions!</p>
                
                <div className="attractions-grid">
                    {attractions.map((attraction) => (
                        <div className="attraction-card" key={attraction.id}>
                            <div className="attraction-image-container">
                                <div className="attraction-image" style={{ backgroundImage: `url(${attraction.image})` }}></div>
                            </div>
                            <div className="attraction-content">
                                <h2 className="attraction-name">{attraction.name}</h2>
                                <p className="attraction-description">{attraction.description}</p>
                                <div className="attraction-details">
                                    <span className="attraction-detail">
                                        <strong>Minimum Height:</strong> {attraction.minHeight}
                                    </span>
                                    <span className="attraction-detail">
                                        <strong>Thrill Level:</strong> {attraction.thrillLevel}
                                    </span>
                                </div>
                                <div className="attraction-footer">
                                    <button className="attraction-button" onClick={() => navigate(`/tickets`)}>
                                        Buy Tickets
                                    </button>
                                    <span className="attraction-status">
                                        {/* Status will be fetched from backend */}
                                        Open
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Activities;