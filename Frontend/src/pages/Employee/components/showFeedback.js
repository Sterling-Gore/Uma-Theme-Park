import React, { useEffect, useState } from "react";
import "./showFeedback.css"; // Import the CSS file

const ShowFeedback = ({ setActiveTab }) => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/getFeedback`, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch feedback");
                }

                const result = await response.json();
                setFeedbacks(result);
            } catch (error) {
                console.error("Error fetching feedback:", error);
                setError(error.message);
            }
        };

        fetchFeedback();
    }, []);

    return (
        <div className="feedback-container">
            <h2>Feedback</h2>
            {error && <p className="error">{error}</p>}
            {feedbacks.length === 0 ? (
                <p>No feedback available.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Comments</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feedbacks.map((feedback, index) => (
                            <tr key={index}>
                                <td>{feedback.first_name} {feedback.last_name}</td>
                                <td>{new Date(feedback.feedback_date).toISOString().split("T")[0]}</td>
                                <td>{feedback.feedback_type}</td>
                                <td>{feedback.rating_comments}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <button onClick={() => setActiveTab("dashboard")}>Back to Dashboard</button>
        </div>
    );
};

export default ShowFeedback;
