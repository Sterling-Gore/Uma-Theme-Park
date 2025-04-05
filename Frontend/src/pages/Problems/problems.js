import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import "./problems.css"
import AuthContext from "../../context/AuthContext";

function Problems() {
    const [formData, setFormData] = useState({
        rating_comments: "",
        feedback_type: "General"
    });
    const navigate = useNavigate();
    const alertShown = useRef(false);
    const { isLoggedIn, isLoading } = useContext(AuthContext);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState("");
    const [submitStatus, setSubmitStatus] = useState("");

    useEffect(() => {
        if (!isLoading && !isLoggedIn && !alertShown.current) {
            alertShown.current = true;
            navigate("/login");
        }
    }, [isLoggedIn, navigate, isLoading]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage("");
        setSubmitStatus("");

        try {
            // Get customer_id from localStorage
            const customer_id = localStorage.getItem("userID");
            
            // Prepare data for submission
            const submitData = {
                ...formData,
                customer_id
            };

            // Make API call to submit feedback
            const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/submitFeedback`, {
                method: "POST",
                mode: 'cors',
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(submitData)
            });

            const data = await response.json();
            
            if (response.ok) {
                setSubmitStatus("success");
                setSubmitMessage("Thank you for your feedback! We'll look into this issue.");
                // Reset form
                setFormData({
                    rating_comments: "",
                    feedback_type: "General"
                });
            } else {
                setSubmitStatus("error");
                setSubmitMessage(data.message || "Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting feedback:", error);
            setSubmitStatus("error");
            setSubmitMessage("Failed to submit feedback. Please check your connection and try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="page-container">
        <div className="problems-container">
            <div className="problems-header">
                <h1>Report a Problem</h1>
                <p>We're sorry you've encountered an issue. Please help us improve by reporting your problem below.</p>
            </div>

            {submitMessage && (
                <div className={`submit-message ${submitStatus}`}>
                    {submitMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="feedback-form">
                <div className="form-group">
                    <label htmlFor="feedback_type">Problem Type:</label>
                    <select 
                        id="feedback_type" 
                        name="feedback_type" 
                        className= "feedbackType-box"
                        value={formData.feedback_type}
                        onChange={handleChange}
                        required
                    >
                        <option value="General">General Issue</option>
                        <option value="Attraction">Attraction Problem</option>
                        <option value="Food">Food/Dining Issue</option>
                        <option value="Facilities">Facilities Problem</option>
                        <option value="Staff">Staff Interaction</option>
                        <option value="Technical">Website/App Technical Issue</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="rating_comments">Describe Your Problem:</label>
                    <textarea
                        id="rating_comments"
                        name="rating_comments"
                        rows="6"
                        maxLength={300}
                        value={formData.rating_comments}
                        onChange={handleChange}
                        placeholder="Please provide details about the issue you encountered... (300 characters max)"
                        required
                    ></textarea>
                    <div className="character-count">
                        {formData.rating_comments.length}/300 characters
                    </div>
                </div>

                <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Submitting..." : "Submit Problem Report"}
                </button>
            </form>
        </div>
        </div>
    );
}

export default Problems;