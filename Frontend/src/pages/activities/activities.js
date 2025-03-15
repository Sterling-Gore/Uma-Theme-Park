import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "../../App.css";
import "./activities.css";

function Activities() {
    const navigate = useNavigate();
    const [attractions, setAttractions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAttractions = async () => {
            try {
                const response = await fetch('http://localhost:4000/getAttractions', {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                      'Content-Type': 'application/json'
                    }
                  });
                if (!response.ok) {
                    throw new Error('Failed to fetch attractions');
                }
                const result = await response.json();

                if (result.success) {
                    setAttractions(result.data);
                } else {
                    throw new Error(result.message || 'Failed to fetch attractions');
                }
            } catch (error) {
                console.error('Error fetching attractions:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAttractions();
    }, []);


    const getStatusClass = (status) => {
        switch (status) {
            case 'closed':
                return 'status-closed';
            case 'maintenance':
                return 'status-maintenance';
            case 'open':
                return ''; //default green
            default:
                return '';
        }
    };


    const formatDuration = (duration) => {
        if (!duration) return 'N/A';

        const [hours, minutes, seconds] = duration.split(':').map(Number);

        let formatted = '';
        if (hours > 0) formatted += `${hours}h `;
        if (minutes > 0) formatted += `${minutes}m `;
        if (seconds > 0) formatted += `${seconds}s`;

        return formatted.trim() || 'N/A';
    };

    // Show loading message
    if (loading) {
        return (
            <div className="activities-background">
                <div className="activities-container">
                    <h1 className="activities-title">Park Attractions</h1>
                    <p className="activities-intro">Loading attractions...</p>
                </div>
            </div>
        );
    }


    if (error) {
        return (
            <div className="activities-background">
                <div className="activities-container">
                    <h1 className="activities-title">Park Attractions</h1>
                    <p className="activities-intro">Error loading attractions: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="activities-background">
            <div className="activities-container">
                <h1 className="activities-title">Park Attractions</h1>
                <p className="activities-intro">Discover the excitement and adventure waiting for you at our world-class attractions!</p>

                <div className="attractions-grid">
                    {attractions.map((attraction) => (
                        <div className="attraction-card" key={attraction.attraction_id}>
                            <div className="attraction-content">
                                <h2 className="attraction-name">{attraction.attraction_name}</h2>
                                <p className="attraction-description">{attraction.description}</p>
                                <div className="attraction-details">
                                    <span className="attraction-detail">
                                        <strong>Capacity:</strong> {attraction.attraction_capacity} people
                                    </span>
                                    <span className="attraction-detail">
                                        <strong>Duration:</strong> {formatDuration(attraction.attraction_duration)}
                                    </span>
                                </div>
                                <div className="attraction-footer">
                                    <button className="attraction-button" onClick={() => navigate(`/tickets`)}>
                                        Buy Tickets
                                    </button>
                                    <span className={`attraction-status ${getStatusClass(attraction.attraction_status)}`}>
                                        {attraction.attraction_status.charAt(0).toUpperCase() + attraction.attraction_status.slice(1)}
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