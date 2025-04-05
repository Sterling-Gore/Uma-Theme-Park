import React, { useEffect, useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
//import "../../App.css";
import AuthContext from "../../context/AuthContext";
import Calendar from "react-calendar";
import "./ticket.css"

function Tickets() {
    const navigate = useNavigate();
    const { isLoggedIn, userType, isLoading } = useContext(AuthContext);
    const alertShown = useRef(false);
    //const [error, setError] = useState("");
    const [step, setStep] = useState(1);
    const [numOfDays, setNumOfDays] = useState(0);
    const [numOfTickets, setNumOfTickets] = useState(0);
    const [numOfChildrenTickets, setNumOfChildrenTickets] = useState(0);
    const [numOfStandardTickets, setNumOfStandardTickets] = useState(0);
    const [numOfSeniorTickets, setNumOfSeniorTickets] = useState(0);

    //const [selectedDate, setSelectedDate] = useState(null);
    const [selectedDates, setSelectedDates] = useState([]);
    const [selectedDatesForFoodPass, setSelectedDatesForFoodPass] = useState([]);
    const [price, setPrice] = useState(0);
    const [attractions, setAttractions] = useState([]);

    const today = new Date();
    today.setHours(0,0,0,0);
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 12); // Add 12 months

    // Redirect employees and managers to their portals
    useEffect(() => {
        if (!isLoading) {
            if (userType === "employee") {
                navigate('/EmployeePortal');
            } else if (userType === "manager") {
                navigate('/ManagerPortal');
            }
        }
    }, [userType, navigate, isLoading]);

    // Verify auth status for ticket purchase
    useEffect(() => {
        if (!isLoading && !isLoggedIn && !alertShown.current) {
            alertShown.current = true;
            navigate("/login");
        }
    }, [isLoggedIn, navigate, isLoading]);


    useEffect(() => {
        const fetchAttractions = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/getAttractions`, {
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
                const attractionsData = result.data.map((attraction) => {
                    return{
                        ...attraction,
                        isInterested : false
                    };
                }) 

                if (result.success) {
                    setAttractions(attractionsData);
                } else {
                    throw new Error(result.message || 'Failed to fetch attractions');
                }
            } catch (error) {
                console.error('Error fetching attractions:', error);
                
            } 
        };

        fetchAttractions();
    }, []);

    // Only render content after loading and redirects are done
    if (isLoading || userType === "employee" || userType === "manager") {
        return null;
    }
    


    const handleDays = (e) => {
        setSelectedDates([]);
        setNumOfDays(e);
    }

    const handleStandardTickets = (e) => {
        let value = Math.min(Math.max(numOfStandardTickets + e, 0), 15);
        if (value !== numOfStandardTickets)
        {
            setNumOfStandardTickets(numOfStandardTickets + e);
            setNumOfTickets(numOfTickets + e);
        }

    }

    const handleChildrenTickets = (e) => {
        let value = Math.min(Math.max(numOfChildrenTickets + e, 0), 15);
        if (value !== numOfChildrenTickets)
        {
            setNumOfChildrenTickets(numOfChildrenTickets + e);
            setNumOfTickets(numOfTickets + e);
        }
    }

    const handleSeniorTickets = (e) => {
        let value = Math.min(Math.max(numOfSeniorTickets + e, 0), 15);
        if (value !== numOfSeniorTickets)
        {
            setNumOfSeniorTickets(numOfSeniorTickets + e);
            setNumOfTickets(numOfTickets + e);
        }
    };


    const handleDateChange = (date) => {
        const dateString = date.toDateString(); // Convert to readable string format
        if (selectedDates.length === numOfDays && !selectedDates.includes(dateString))
        {
            return;
        }
        setSelectedDatesForFoodPass([]);

        setSelectedDates((prevDates) => {
            let updatedDates;
    
            if (prevDates.includes(dateString)) {
                // Remove the date if it's already selected
                updatedDates = prevDates.filter((d) => d !== dateString);
            } else {
                // Add new date and sort the array
                updatedDates = [...prevDates, dateString].sort((a, b) => new Date(a) - new Date(b));
            }
    
            return updatedDates;
        });
    };

    const tileDisabled = ({date}) => {
        if (selectedDates.length === 0)
        {
            return (selectedDates.length === numOfDays && !selectedDates.includes(date.toDateString()))
        }

        const firstSelectedDate = new Date(selectedDates[0]);
        const minAllowedDate = new Date(firstSelectedDate);
        const maxAllowedDate = new Date(firstSelectedDate);
        maxAllowedDate.setDate(maxAllowedDate.getDate() + 14); // Add 14 days
        //minAllowedDate.setDate(minAllowedDate.getDate() -7);

        return (date < minAllowedDate || date > maxAllowedDate) || (selectedDates.length === numOfDays && !selectedDates.includes(date.toDateString()));
    };

    const isSelected = (date) => selectedDates.includes(date.toDateString());


    const handleDateChangeForFoodPass = (date) => {
        const dateString = date.toDateString(); // Convert to readable string format
        if (selectedDatesForFoodPass.length === numOfDays && !selectedDatesForFoodPass.includes(dateString))
        {
            return;
        }

        setSelectedDatesForFoodPass((prevDates) => {
            let updatedDates;
        
            if (prevDates.includes(dateString)) {
                // Remove the date if it's already selected
                updatedDates = prevDates.filter((d) => d !== dateString);
            } else {
                // Add new date and sort the array
                updatedDates = [...prevDates, dateString].sort((a, b) => new Date(a) - new Date(b));
            }
        
            return updatedDates;
        });
    };

    const isSelectedForFoodPass = (date) => selectedDatesForFoodPass.includes(date.toDateString());


    const handleAddToCart = async () => {
        const interestedAttractions = attractions.map((item) => {
            if(item.isInterested)
            {
                return item.attraction_name;
            }
        });
        const ticketData = {
            numOfStandardTickets,
            numOfChildrenTickets,
            numOfSeniorTickets,
            numOfTickets,
            numOfDays,
            selectedDates,
            selectedDatesForFoodPass,
            price,
            interestedAttractions
        };
    
        // Retrieve existing cart from local storage (if any)
        const existingCart = JSON.parse(localStorage.getItem("cart-tickets")) || [];
    
        // Add the new ticket selection
        const updatedCart = [...existingCart, ticketData];
    
        // Save updated cart back to local storage
        localStorage.setItem("cart-tickets", JSON.stringify(updatedCart));


    
        navigate("/shopping-cart");
    }


    const updateAttractionInterest = (attraction_id) => {
        console.log(attraction_id);
        const updatedAttraction = attractions.map((attraction) => {
            if(attraction_id === attraction.attraction_id)
            {
                attraction.isInterested = !attraction.isInterested;
            }
            return attraction;
        })
        setAttractions(updatedAttraction);
    }




    //useEffect(() => {setNumOfDays[1]}, [userType, navigate, isLoading]);

    //step 1:
    //select number of days
    //select number of people for tickets (kids, regular, senior)
    //select number of days for food pass

    //step 2:
    //select the days
    return (
        <div className="ticket-page-wrapper">
            <div className="ticket-container">
                {step === 1 && (
                    <>
                        <div className="selection-section">
                            <h2 className="section-title">Select the Number of Days</h2>
                            <div className="selection-content">
                                <div className="day-selection-grid">
                                    {[...Array(7)].map((_, index) => (
                                        <button 
                                            key={index + 1}
                                            className={`day-button ${numOfDays === index + 1 ? "day-button-selected" : ""}`}
                                            onClick={() => handleDays(index + 1)}
                                        >
                                            {index + 1} day{index + 1 > 1 ? 's' : ''}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
    
                        <div className="selection-section">
                            <h2 className="section-title">Select the Number of Tickets</h2>
                            <div className="selection-content">
                                <div className="ticket-total">
                                    <h1 className="total-count">{numOfTickets}</h1>
                                </div>
                                <div className="ticket-type-container">
                                    <div className="ticket-type">
                                        <div className="ticket-type-name">Standard Tickets:  $10 per day</div>
                                        <div className="ticket-counter">
                                            <p className="ticket-age-range">Ages 13-59</p>
                                            <div className="counter-controls">
                                                <button className="counter-button" onClick={() => handleStandardTickets(-1)}> - </button>
                                                <p className="counter-value">{numOfStandardTickets}</p>
                                                <button className="counter-button" onClick={() => handleStandardTickets(1)}> + </button>
                                            </div>
                                        </div>
                                    </div>
    
                                    <div className="ticket-type">
                                        <div className="ticket-type-name">Child Tickets:  $6 per day</div>
                                        <div className="ticket-counter">
                                            <p className="ticket-age-range">Ages 0-12</p>
                                            <div className="counter-controls">
                                                <button className="counter-button" onClick={() => handleChildrenTickets(-1)}> - </button>
                                                <p className="counter-value">{numOfChildrenTickets}</p>
                                                <button className="counter-button" onClick={() => handleChildrenTickets(1)}> + </button>
                                            </div>
                                        </div>
                                    </div>
    
                                    <div className="ticket-type">
                                        <div className="ticket-type-name">Senior Tickets:  $4 per day</div>
                                        <div className="ticket-counter">
                                            <p className="ticket-age-range">Ages 60+</p>
                                            <div className="counter-controls">
                                                <button className="counter-button" onClick={() => handleSeniorTickets(-1)}> - </button>
                                                <p className="counter-value">{numOfSeniorTickets}</p>
                                                <button className="counter-button" onClick={() => handleSeniorTickets(1)}> + </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
    
                        {(numOfSeniorTickets + numOfStandardTickets) === 0 || numOfDays === 0 ? 
                        (<p className="instruction-text">Select Days and Tickets</p>) : 
                        (<button className="primary-button continue-button" onClick={() => setStep(2)}>Continue</button>)}
                    </>
                )}
    
                {step === 2 && (
                    <>
                        <button className="back-button"onClick={() => setStep(1)}>Go back</button>
                        <div className="calendar-section">
                            <p className="section-subtitle">Select Days</p>
                            <Calendar
                                onClickDay={handleDateChange} 
                                tileClassName={({ date }) => isSelected(date) ? "selected-date" : null}
                                tileDisabled={tileDisabled} 
                                minDate={today}
                                maxDate={maxDate}
                                className="calendar-component"
                            />
                            <ul className="date-list">
                                {selectedDates.map((date, index) => (
                                    <li className="date-item" key={index}>{date}</li>
                                ))}
                            </ul>
                        </div>
    
                        {selectedDates.length !== numOfDays ? 
                        (<p className="instruction-text">Select {numOfDays} day{numOfDays > 1 ? 's' : ''}</p>) : 
                        (<button className="primary-button continue-button" onClick={() => (setStep(3))}> Continue </button>)}
                    </>
                )}
    
                {step === 3 && (
                    <>
                        <button className="back-button" onClick={() => setStep(2)}>Go back</button>
                        <div className="calendar-section">
                            <p className="section-subtitle">Add a Food Pass</p>
                            <Calendar
                                onClickDay={handleDateChangeForFoodPass} 
                                tileClassName={({ date }) => isSelectedForFoodPass(date) ? "selected-date" : null}
                                tileDisabled={({ date }) => !selectedDates.includes(date.toDateString())}
                                minDate={today}
                                maxDate={maxDate}
                                className="calendar-component"
                            />
                            <ul className="date-list">
                                {selectedDatesForFoodPass.map((date, index) => (
                                    <li className="date-item" key={index}>{date}</li>
                                ))}
                            </ul>
                        </div>
                        <button className="primary-button continue-button" onClick={() => (setStep(4))}>
                            Continue
                        </button>
                    </>
                )}
    
                {step === 4 && (
                    <>
                    <button className="back-button" onClick={() => setStep(3)}>Go back</button>
                    <h1 className="page-title">What attractions are you interested in going to?</h1>
                    <div className="attractions-grid">
                    {attractions.map((attraction) => (
                        <div className="attraction-item" key={attraction.attraction_id}>
                            <h3 className="attraction-name">{attraction.attraction_name}</h3>
                            <button key={attraction.attraction_id} className={`day-button ${attraction.isInterested ? "attraction-selected" : "attraction-unselected"}`} onClick={() => updateAttractionInterest(attraction.attraction_id) }>Select</button>
                        </div>
                    ))}
                    </div>
                    <button className="primary-button continue-button" onClick={() => (setStep(5),setPrice(numOfDays * (4*numOfSeniorTickets + 6*numOfChildrenTickets + 10*numOfStandardTickets)))}>
                        Continue
                    </button>
                    </>
                )}
    
                {step === 5 && (
                    <>
                        <button className="back-button" onClick={() => setStep(4)}>Go back</button>
                        <h2 className="summary-title">Review Your Tickets and Food Passes!</h2>
                        <p className="ticket-duration">{numOfDays}-Day Ticket</p>
                        <ul className="date-list summary-list">
                            {selectedDates.map((date, index) => (
                                <li className="date-item summary-item" key={index}>{date} {selectedDatesForFoodPass.includes(date) ? `(Includes $${numOfTickets * 5.99} Food Pass)` : ''}</li>
                            ))}
                        </ul>
                        <div className="summary-container">
                            <div className="summary-row">
                                <p className="summary-label">{numOfStandardTickets > 0 ? `${numOfStandardTickets} Standard Ticket${numOfStandardTickets > 1 ? 's' : ''} ($${numOfDays * 10} Per Ticket)` : ""}</p>
                                <p className="summary-value">{numOfStandardTickets > 0 ? `$${numOfDays * 10 * numOfStandardTickets}` : ""}</p>
                            </div>
                            <div className="summary-row">
                                <p className="summary-label">{numOfChildrenTickets > 0 ? `${numOfChildrenTickets} Child Ticket${numOfChildrenTickets > 1 ? 's' : ''} ($${numOfDays * 6} Per Ticket)` : ""}</p>
                                <p className="summary-value">{numOfChildrenTickets > 0 ? `$${numOfDays * 6 * numOfChildrenTickets}` : ""}</p>
                            </div>
                            <div className="summary-row">
                                <p className="summary-label">{numOfSeniorTickets > 0 ? `${numOfSeniorTickets} Senior Ticket${numOfSeniorTickets > 1 ? 's' : ''} ($${numOfDays * 4} Per Ticket)` : ""}</p>
                                <p className="summary-value">{numOfSeniorTickets > 0 ? `$${numOfDays * 4 * numOfSeniorTickets}` : ""}</p>
                            </div>
                            <div className="summary-row total-row">
                                <p className="summary-label total-label">Subtotal</p>
                                <p className="summary-value total-value">${((selectedDatesForFoodPass.length * (numOfTickets * 5.99) ) + numOfDays * (4*numOfSeniorTickets + 6*numOfChildrenTickets + 10*numOfStandardTickets)).toFixed(2)} USD</p>
                            </div>
                        </div>
                        <button className="primary-button cart-button" onClick={handleAddToCart}>Add to Cart</button>
                    </>
                )}
            </div>
        </div>
    );
}

export default Tickets;