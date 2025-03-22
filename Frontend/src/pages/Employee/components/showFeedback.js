import React, { useEffect, useState } from "react";

const ShowFeedback = ({ setActiveTab }) => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/getFeedback`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch feedback');
                }

                const result = await response.json();
                setFeedbacks(result); // Store feedback data
            } catch (error) {
                console.error('Error fetching feedback:', error);
                setError(error.message);
            }
        };

        fetchFeedback();
    }, []); // Ensures it runs only once when component mounts

    return (
        <div className="feedback-container">
            <h2>Feedback</h2>
            {error && <p className="error">{error}</p>}
            {feedbacks.length === 0 ? (
                <p>No feedback available.</p>
            ) : (
                <ul>
    {feedbacks.map((feedback, index) => (
        <li key={index}>
            <strong>{feedback.first_name} {feedback.last_name}</strong> - {new Date(feedback.feedback_date).toISOString().split("T")[0]}  
            <br />
            <em>Type:</em> {feedback.feedback_type}  
            <br />
            <em>Comments:</em> {feedback.rating_comments}
        </li>
    ))}
</ul>
            )}
            <button onClick={() => setActiveTab('dashboard')}>Back to Dashboard</button>
        </div>
    );
};

export default ShowFeedback;
