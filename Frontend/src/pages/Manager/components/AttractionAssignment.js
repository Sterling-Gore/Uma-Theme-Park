import React, { useState, useEffect } from 'react';

const AttractionAssignment = ({ setActiveTab }) => {
    const [employeeInfo, setEmployeeInfo] = useState({
        email: '',
        first_name: '',
        last_name: '',
        current_attraction: '',
        current_attraction_name: ''
    });

    const [newAttractionOrDining, setNewAttractionOrDining] = useState('');
    const [isAttraction, setIsAttraction] = useState(null);
    const [attractions, setAttractions] = useState([]);
    const [dining, setDining] = useState([]);
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
        setNewAttractionOrDining(storedEmployee.attraction || '');
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

    useEffect(() => {
        const fetchDining = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/getDiningName`);

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setDining(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching dining:', err);
                setError('Failed to load dining. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchDining();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
        
            const updateData = {
                email: employeeInfo.email,
                attraction_or_dining: newAttractionOrDining,
                is_attraction : isAttraction
            };

            if (!updateData.email) {
                alert('Error: Employee information is missing. Please try again.');
                return;
            }

            console.log("Sending attraction/dining update data:", updateData);

           
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
                throw new Error(`Failed to update attraction/dining assignment: ${response.status} ${errorText}`);
            }

            const data = await response.json();
            console.log("Update response data:", data);

            if (data.success || data.message === "Success") {
                setActiveTab('view');
                localStorage.removeItem('editEmployee');
            } else {
                alert('Error updating attraction/dining assignment: ' + data.message);
            }
        } catch (error) {
            console.error('Error updating attraction/dining assignment:', error);
            alert('Error updating attraction/dining assignment: ' + error.message);
        }
    };

    const handleAttractionOrDiningChange = (e) => {
        const selectedValue = e.target.value;
        setNewAttractionOrDining(selectedValue);
        setIsAttraction(attractions.some(attraction => attraction.attraction_id === selectedValue));
        
    }

    return (
        <div className="assignment-container">
            <div className="content-header">
                <h2>Modify Employee Attraction or Dining Assignment</h2>
            </div>

            <div className="employee-card">
                <div className="employee-info">
                    <h3>{employeeInfo.first_name} {employeeInfo.last_name}</h3>
                    <p><strong>Current Attraction or Dining:</strong> {employeeInfo.current_attraction_name}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="assignment-form">
                <div className="form-group">
                    <label htmlFor="attraction">New Attraction or Dining Assignment</label>
                    <select
                        id="attraction"
                        name="attraction"
                        value={newAttractionOrDining}
                        onChange={handleAttractionOrDiningChange}
                        required
                        disabled={loading}
                        className="attraction-select"
                    >
                        <option value="">Select Attraction or Dining</option>
                        {error ? (
                            <option value="" disabled>{error}</option>
                        ) : loading ? (
                            <option value="" disabled>Loading attractions...</option>
                        ) : (
                            <>
                            {attractions.map(attraction => (
                                <option
                                    key={attraction.attraction_id}
                                    value={attraction.attraction_id}
                                >
                                    {`[ATTRACTION]:  ${attraction.attraction_name}`}
                                </option>
                            ))}
                            {dining.map(dining_item => (
                                <option
                                    key={dining_item.dining_id}
                                    value={dining_item.dining_id}
                                >
                                    {`[DINING]:  ${dining_item.dining_name}`}
                                </option>
                            ))}
                            </>
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