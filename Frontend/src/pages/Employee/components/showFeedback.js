import React from "react";
const ShowFeedback = ({ setActiveTab }) => {
    return (
      <div className="feedback-container">
        <h2>Feedback</h2>
        <p>Access feedbacks.</p>
        <button onClick={() => setActiveTab('dashboard')}>Back to Dashboard</button>
      </div>
    );
  };
  export default ShowFeedback;