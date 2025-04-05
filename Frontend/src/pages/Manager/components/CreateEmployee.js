import React, { useState, useEffect } from 'react';

const CreateEmployee = ({ setActiveTab }) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        role: '',
        attraction_or_dining: '',
        isAttraction: null,
        email: '',
        phone_number: '',
        password: ''
    });

    const [attractions, setAttractions] = useState([]);
    const [dining, setDining] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Validate first and last name (allow only letters and spaces)
    if ((name === 'first_name' || name === 'last_name') && !/^[A-Za-z\s]*$/.test(value)) {
        return;
    }

    // Validate phone number (allow only numbers)
    if (name === 'phone_number' && !/^\d*$/.test(value)) {
        return;
    }
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleAttractionOrDiningChange = (e) => {
        const selectedValue = e.target.value;
        setFormData({
            ...formData,
            attraction_or_dining: selectedValue,
            isAttraction: attractions.some(attraction => attraction.attraction_id === selectedValue)
        })
    }

    useEffect (() => {
        console.log(formData.isAttraction);
    }, [formData])

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(formData.password.length < 8)
        {
            alert("The password length must be atleast 8 characters long");
            return;
        }
        try {
            const createData = { ...formData };

            console.log("Sending create data:", createData);

            const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/createEmployee`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(createData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Create error response:", errorText);
                throw new Error(`Failed to create employee: ${response.status} ${errorText}`);
            }

            const data = await response.json();
            console.log("Create response data:", data);

            if (data.message === "Success") {
                setActiveTab('view');
                // Reset form data after successful creation
                setFormData({
                    first_name: '',
                    last_name: '',
                    role: '',
                    attraction_or_dining: '',
                    isAttraction : null,
                    email: '',
                    phone_number: '',
                    password: ''
                });
            } else {
                alert('Error creating employee: ' + data.message);
            }
        } catch (error) {
            console.error('Error creating employee:', error);
            alert('Error creating employee: ' + error.message);
        }
    };

    return (
        <div className="employee-form-container">
            <div className="content-header">
                <h2>Create New Employee</h2>
            </div>

            <form onSubmit={handleSubmit} className="employee-form">
                <div className="form-group">
                    <label htmlFor="first_name">First Name</label>
                    <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="last_name">Last Name</label>
                    <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="role">Role</label>
                    <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select Role</option>
                        <option value="employee">employee</option>
                        <option value="manager">manager</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="attraction_or_dining">Assigned Attraction or Dining</label>
                    <select
                        id="attraction_or_dining"
                        name="attraction_or_dining"
                        value={formData.attraction_or_dining || ""}
                        onChange={handleAttractionOrDiningChange}
                        required
                        disabled={loading}
                    >
                        <option value="">Select Attraction or Dining</option>
                        {error ? (
                            <option value="" disabled>{error}</option>
                        ) : loading ? (
                            <option value="" disabled>Loading attractions and dinings...</option>
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

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="phone_number">Phone Number</label>
                    <input
                        type="tel"
                        id="phone_number"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        maxLength={10}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        maxLength={30}
                        minLength={8}
                    />
                </div>

                <div className="form-actions">
                    <button type="submit" className="submit-btn">
                        Create Employee
                    </button>
                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={() => setActiveTab('view')}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateEmployee;