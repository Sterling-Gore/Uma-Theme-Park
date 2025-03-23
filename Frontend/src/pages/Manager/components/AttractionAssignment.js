import React, { useState, useEffect } from 'react';

const AttractionAssignment = ({ setActiveTab }) => {
    const [employeeInfo, setEmployeeInfo] = useState({
        email: '',
        first_name: '',
        last_name: '',
        current_attraction: '',
        current_attraction_name: ''
    });

    const [newAttraction, setNewAttraction] = useState('');
    const [attractions, setAttractions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const storedEmployee = JSON.parse(localStorage.getItem('editEmployee') || '{}');
        setEmployeeInfo({
            email: storedEmployee.email || '',
            first_name: storedEmployee.first_name || '',
            last_name: storedEmployee.last_name || '',
            current_attraction: storedEmployee.attraction || '',
            current_attraction_name: storedEmployee.attraction_name || 'Not Assigned'
        });

        // Set the initial value for the dropdown
        setNewAttraction(storedEmployee.attraction || '');
    }, []);

    useEffect(() => {
        const fetchAttractions = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/getAttractionName`);

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setAttractions(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching attractions:', err);
                setError('Failed to load attractions. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchAttractions();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Only sending email and attraction - nothing else can be changed
            const updateData = {
                email: employeeInfo.email,
                attraction: newAttraction
            };

            if (!updateData.email) {
                alert('Error: Employee information is missing. Please try again.');
                return;
            }

            console.log("Sending attraction update data:", updateData);

            // Using the dedicated endpoint for attraction updates only
            const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/updateEmployeeAttraction`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Update error response:", errorText);
                throw new Error(`Failed to update attraction assignment: ${response.status} ${errorText}`);
            }

            const data = await response.json();
            console.log("Update response data:", data);

            if (data.success || data.message === "Success") {
                alert('Attraction assignment updated successfully!');
                setActiveTab('view');
                localStorage.removeItem('editEmployee');
            } else {
                alert('Error updating attraction assignment: ' + data.message);
            }
        } catch (error) {
            console.error('Error updating attraction assignment:', error);
            alert('Error updating attraction assignment: ' + error.message);
        }
    };

    return (
        <div className="assignment-container">
            <div className="content-header">
                <h2>Modify Employee Attraction Assignment</h2>
            </div>

            <div className="employee-card">
                <div className="employee-info">
                    <h3>{employeeInfo.first_name} {employeeInfo.last_name}</h3>
                    <p><strong>Current Attraction:</strong> {employeeInfo.current_attraction_name}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="assignment-form">
                <div className="form-group">
                    <label htmlFor="attraction">New Attraction Assignment</label>
                    <select
                        id="attraction"
                        name="attraction"
                        value={newAttraction}
                        onChange={(e) => setNewAttraction(e.target.value)}
                        required
                        disabled={loading}
                        className="attraction-select"
                    >
                        <option value="">Select Attraction</option>
                        {error ? (
                            <option value="" disabled>{error}</option>
                        ) : loading ? (
                            <option value="" disabled>Loading attractions...</option>
                        ) : (
                            attractions.map(attraction => (
                                <option
                                    key={attraction.attraction_id}
                                    value={attraction.attraction_id}
                                >
                                    {attraction.attraction_name}
                                </option>
                            ))
                        )}
                    </select>
                </div>

                <div className="form-actions">
                    <button type="submit" className="submit-btn">
                        Update Assignment
                    </button>
                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={() => {
                            setActiveTab('view');
                            localStorage.removeItem('editEmployee');
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AttractionAssignment;