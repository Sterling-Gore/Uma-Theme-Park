import React, { useEffect, useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import AuthContext from "../../context/AuthContext";
import Calendar from "react-calendar";

function Tickets() {
    const navigate = useNavigate();
    const { isLoggedIn, userType, isLoading } = useContext(AuthContext);
    const alertShown = useRef(false);
    const [error, setError] = useState("");
    const [step, setStep] = useState(1);
    const [numOfDays, setNumOfDays] = useState(0);
    const [numOfTickets, setNumOfTickets] = useState(0);
    const [numOfChildrenTickets, setNumOfChildrenTickets] = useState(0);
    const [numOfStandardTickets, setNumOfStandardTickets] = useState(0);
    const [numOfSeniorTickets, setNumOfSeniorTickets] = useState(0);

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedDates, setSelectedDates] = useState([]);
    const [selectedDatesForFoodPass, setSelectedDatesForFoodPass] = useState([]);

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
            alert("Please login to purchase tickets!");
            navigate("/login");
        }
    }, [isLoggedIn, navigate, isLoading]);

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

        setSelectedDates((prevDates) =>
            prevDates.includes(dateString)
                ? prevDates.filter((d) => d !== dateString) // Remove if already selected
                : [...prevDates, dateString] // Add if not selected
        );
    };

    const isSelected = (date) => selectedDates.includes(date.toDateString());


    const handleDateChangeForFoodPass = (date) => {
        const dateString = date.toDateString(); // Convert to readable string format
        if (selectedDatesForFoodPass.length === numOfDays && !selectedDatesForFoodPass.includes(dateString))
        {
            return;
        }

        setSelectedDatesForFoodPass((prevDates) =>
            prevDates.includes(dateString)
                ? prevDates.filter((d) => d !== dateString) // Remove if already selected
                : [...prevDates, dateString] // Add if not selected
        );
    };

    const isSelectedForFoodPass = (date) => selectedDatesForFoodPass.includes(date.toDateString());




    //useEffect(() => {setNumOfDays[1]}, [userType, navigate, isLoading]);

    //step 1:
    //select number of days
    //select number of people for tickets (kids, regular, senior)
    //select number of days for food pass

    //step 2:
    //select the days
    return (
        <>
        <div /*container*/>
        {step === 1 && (
            <>
            <div /*select number of days*/>
                <h2>Select the Number of Days</h2>
                <div /*buttons container*/>
                    <div /*day buttons*/>
                    {[...Array(7)].map((_, index) => (
                        <button 
                            key={index + 1}
                            className={numOfDays === index + 1 ? "App-link" : ""}
                            onClick={() => handleDays(index+1)}
                        >
                            {index + 1} day{index + 1 > 1 ? 's' : ''}
                        </button>
                    ))}
                    </div>
                </div>
            </div>
            
            <div /*Select number of tickets*/>
                <h2>Select the Number of Tickets</h2>
                <div /*tickets container*/>
                <h1> {(numOfTickets)} </h1>
                    <div /*Standard Tickets*/>
                        <div>Standard Tickets</div>
                        <div /*tickets counter*/>
                            <p>Ages 13-59</p>
                            <button onClick={() => handleStandardTickets(-1)} > - </button>
                            <p> {(numOfStandardTickets)}</p>
                            <button onClick={() => handleStandardTickets(1)}> + </button>
                        </div>
                    </div>

                    <div /*Child Tickets*/>
                        <div>Child Tickets</div>
                        <div /*tickets counter*/>
                            <p>Ages 0-12</p>
                            <button onClick={() => handleChildrenTickets(-1)}> - </button>
                            <p> {(numOfChildrenTickets)}</p>
                            <button onClick={() => handleChildrenTickets(1)}> + </button>
                        </div>
                    </div>
                    
                    <div /*Regular Tickets*/>
                        <div>Senior Tickets</div>
                        <div /*tickets counter*/>
                            <p>Ages 60+</p>
                            <button onClick={() => handleSeniorTickets(-1)}> - </button>
                            <p> {(numOfSeniorTickets)}</p>
                            <button onClick={() => handleSeniorTickets(1)}> + </button>
                        </div>
                    </div>
                </div>
            </div>

            
            { (numOfSeniorTickets + numOfStandardTickets) === 0 || numOfDays === 0? 
            (<p> Select Days and Tickets</p>) : 
            (<button onClick={() => setStep(2)}> continue </button>)}
            </>
        )}


        
        {step === 2 && (
            <>
            <button onClick={() => setStep(1)}> go back </button>
            <div className="calendar-container">
                <p>Select days</p>
                <Calendar
                    onClickDay={handleDateChange} 
                    tileClassName={({ date }) => isSelected(date) ? "selected-date" : null}
                    tileDisabled={({ date }) => selectedDates.length === numOfDays && !selectedDates.includes(date.toDateString())} // Disable non-selected dates
                    minDate={today}
                    maxDate={maxDate}
                />
                <ul>
                    {selectedDates.map((date, index) => (
                        <li key={index}>{date}</li>
                    ))}
                </ul>
            </div>

            { selectedDates.length !== numOfDays ? 
            (<p> Select {numOfDays} day{numOfDays > 1 ? 's' : ''}</p>) : 
            (<button onClick={() => setStep(3)}> continue </button>)}
            </>
        )}

        {step ===3 && (
            <>
            <button onClick={() => setStep(2)}> go back </button>
            <div className="calendar-container">
                <p>Add a food pass</p>
                <Calendar
                    onClickDay={handleDateChangeForFoodPass} 
                    tileClassName={({ date }) => isSelectedForFoodPass(date) ? "selected-date" : null}
                    tileDisabled={({ date }) => !selectedDates.includes(date.toDateString())} // Disable non-selected dates
                    minDate={today}
                    maxDate={maxDate}
                />
                <ul>
                    {selectedDatesForFoodPass.map((date, index) => (
                        <li key={index}>{date}</li>
                    ))}
                </ul>
            </div>
            <button onClick={() => setStep(4)}> continue </button>
            </>
        )}

        {step ===4 && (
            <>
            <button onClick={() => setStep(3)}> go back </button>
            <h2> Review Your Tickets and Food Passes!</h2>
            <p>{numOfStandardTickets > 0 ? `${numOfStandardTickets * numOfDays} Standard Ticket${numOfStandardTickets  * numOfDays > 1 ? 's' : ''} ${numOfDays > 1 ? `(${numOfStandardTickets} for each day)` : ""}` : ""}</p>
            <p>{numOfChildrenTickets > 0 ? `${numOfChildrenTickets * numOfDays} Child Ticket${numOfChildrenTickets  * numOfDays > 1 ? 's' : ''} ${numOfDays > 1 ? `(${numOfChildrenTickets} for each day)` : ""}` : ""}</p>
            <p>{numOfSeniorTickets > 0 ? `${numOfSeniorTickets * numOfDays} Senior Ticket${numOfSeniorTickets  * numOfDays > 1 ? 's' : ''} ${numOfDays > 1 ? `(${numOfSeniorTickets} for each day)` : ""}` : ""}</p>
            <ul>
                {selectedDates.map((date, index) => (
                    <>
                    <li key={index}>{date} {selectedDatesForFoodPass.includes(date) ? '(Includes Food Pass)' : ''}</li>
                    </>
                ))}
            </ul>
            <button onClick={() => setStep(5)}> Add to Cart </button>
            </>
        )}

        </div>
        
        {/*
        <div className="tickets-container">
            <h1>Purchase Tickets</h1>
            <div className="ticket-selection">
                <h2>Select Your Ticket Type</h2>
                <div className="ticket-types">
                    <div className="ticket-option">
                        <h3>Day Pass</h3>
                        <p>Full access for one day</p>
                        <p className="price">$89.99</p>
                        <button>Add to Cart</button>
                    </div>
                    <div className="ticket-option">
                        <h3>Weekend Pass</h3>
                        <p>Full access for Saturday & Sunday</p>
                        <p className="price">$149.99</p>
                        <button>Add to Cart</button>
                    </div>
                    <div className="ticket-option">
                        <h3>Annual Pass</h3>
                        <p>Unlimited access for a year</p>
                        <p className="price">$499.99</p>
                        <button>Add to Cart</button>
                    </div>
                </div>
            </div>
        </div> */}
        </>
    );
}

export default Tickets;