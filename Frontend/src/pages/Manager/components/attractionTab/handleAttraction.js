import React, { useEffect, useState, useRef } from "react";
import "./Attraction.css";


const HandleAttraction = ({ setActiveTab }) => {
    const alertShown = useRef(false);

    const [isEditing, setIsEditing] = useState(false);;
    const [step, setStep] = useState(1);

    const [attractions, setAttractions] = useState([]);
    const [refreshAttractions, setRefreshAttractions] = useState(false);
    const [newCapacity, setNewCapacity] = useState("");
    const [newDuration, setNewDuration] = useState("");
    const [newStatus, setNewStatus] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [deleteAttraction, setDeleteAttraction] = useState(null);

    const [newImage, setNewImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);



    
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

                if (result.success) {
                    const attractions = result.data.map((attraction,index) => {
                        return {
                            ...attraction,
                            is_editing_capacity : false,
                            is_editing_duration : false,
                            is_editing_status : false,
                            is_editing_description : false,
                            maintenanceWarning : false
                        };
                    });
                    setAttractions(attractions);
                } else {
                    throw new Error(result.message || 'Failed to fetch attractions');
                }
            } catch (error) {
                console.error('Error fetching attractions:', error);
                //setError(error.message);
            } 
        };

        fetchAttractions();
    }, [refreshAttractions]);


    const handleImageChange = (e) => {
        const file = e.target.files[0]; // Get selected file
        setNewImage( file );
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file); // Convert file to Base64
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
        }
    };

    const EditAttractionImage = (attraction_id) => {
        setIsEditing(true);
        setNewImage(null);
        setImagePreview(null);
        const newAttractions = attractions.map(item => {
            if (item.attraction_id === attraction_id)
            {
                item.is_editing_image = true;
            }
            return item;
        });
        setAttractions(newAttractions);
    };

    const cancelEditAttractionImage = (attraction_id) => {
        setIsEditing(false);
        setNewImage(null);
        setImagePreview(null);
        const newAttraction = attractions.map(item => {
            if (item.attraction_id === attraction_id)
            {
                item.is_editing_image = false;
            }
            return item;
        });
        setAttractions(newAttraction);
    };

    const submitEditAttractionImage = async (attraction_id) => {
        const submitImage = async (base64String) => {
            try {
                if (!base64String) {
                    throw new Error('No Image');
                }
                const dataToSend = {
                    id : attraction_id,
                    newImage : base64String
                }
                const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/updateAttractionImage`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend),
            });
            
            if (!response.ok) {
                throw new Error('Failed to update attraction');
            }
            
            setIsEditing(false);
            setNewImage(null);
            setImagePreview(null);
            setRefreshAttractions(!refreshAttractions);

            } catch (error) {
                console.error('Error fetching attraction:', error);
                alertShown.current = true;
                alert("Error updating attraction");
            }
        }

        const reader = new FileReader();
        reader.readAsDataURL(newImage);
        reader.onload = () => {
            const base64String = reader.result.split(',')[1]; // Remove metadata prefix
            submitImage(base64String);
        };
        

    }

    const EditAttractionCapacity = (attraction_id) => {
        setIsEditing(true);
        const newAttraction = attractions.map(attraction => {
            if (attraction.attraction_id === attraction_id)
            {
                attraction.is_editing_capacity = true;
            }
            return attraction;
        });
        setAttractions(newAttraction);
    };

    const cancelEditAttractionCapacity = (attraction_id) => {
        setIsEditing(false);
        setNewCapacity("");
        const newAttraction = attractions.map(attraction => {
            if (attraction.attraction_id === attraction_id)
            {
                attraction.is_editing_capacity = false;
            }
            return attraction;
        });
        setAttractions(newAttraction);
    };

    const submitEditAttractionCapacity = async (attraction_id) => {
        try {
            const dataToSend = {
                id : attraction_id,
                newCapacity : Number(newCapacity)
            }
            const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/updateAttractionCapacity`, {
            method: 'POST',
            credentials: 'include',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend),
        });
        
        if (!response.ok) {
            throw new Error('Failed to update attraction');
        }
        
        setIsEditing(false);
        setNewCapacity("");
        setRefreshAttractions(!refreshAttractions);

        } catch (error) {
            console.error('Error fetching attraction:', error);
            alertShown.current = true;
            alert("Error updating attraction");
        }
    };

    
    const EditAttractionDuration = (attraction_id) => {
        setIsEditing(true);
        const newAttraction = attractions.map(attraction => {
            if (attraction.attraction_id === attraction_id)
            {
                attraction.is_editing_duration = true;
            }
            return attraction;
        });
        setAttractions(newAttraction);
    };

    const cancelEditAttractionDuration = (attraction_id) => {
        setIsEditing(false);
        setNewDuration("");
        const newAttraction = attractions.map(attraction => {
            if (attraction.attraction_id === attraction_id)
            {
                attraction.is_editing_duration = false;
            }
            return attraction;
        });
        setAttractions(newAttraction);
    };

    const submitEditAttractionDuration = async (attraction_id) => {
        try {
            const dataToSend = {
                id : attraction_id,
                newDuration : newDuration
            }
            const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/updateAttractionDuration`, {
            method: 'POST',
            credentials: 'include',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend),
        });
        
        if (!response.ok) {
            throw new Error('Failed to update attraction');
        }
        
        setIsEditing(false);
        setNewDuration("");
        setRefreshAttractions(!refreshAttractions);

        } catch (error) {
            console.error('Error fetching attraction:', error);
            alertShown.current = true;
            alert("Error updating attraction");
        }
    };

    const EditAttractionStatus = (attraction_id) => {
        setIsEditing(true);
        const newAttraction = attractions.map(attraction => {
            if (attraction.attraction_id === attraction_id)
            {
                attraction.is_editing_status = true;
            }
            return attraction;
        });
        setAttractions(newAttraction);
    };

    const cancelEditAttractionStatus = (attraction_id) => {
        setIsEditing(false);
        setNewStatus("");
        const newAttraction = attractions.map(attraction => {
            if (attraction.attraction_id === attraction_id)
            {
                attraction.is_editing_status = false;
            }
            return attraction;
        });
        setAttractions(newAttraction);
    };
    const cancelSumbitStatus = (attraction_id) => {
        const newAttraction = attractions.map(item => {
            if (item.attraction_id === attraction_id)
            {
                item.maintenanceWarning = false;
            }
            return item;
        });
        setAttractions(newAttraction);
    }

    const submitEditAttractionStatus = async (attraction_id, confirmChanges) => {
        try {
            const dataToSend = {
                id : attraction_id,
                newStatus : newStatus,
                confirmChanges : confirmChanges
            }
            const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/updateAttractionStatus`, {
            method: 'POST',
            credentials: 'include',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend),
        });
        
        if (!response.ok) {
            throw new Error('Failed to update attraction');
        }
        const result = await response.json();
        if(result.status === "Blocked")
        {
            //setMaintenanceWarning(true);
            const newAttraction = attractions.map(item => {
                if (item.attraction_id === attraction_id)
                {
                    item.maintenanceWarning = true;
                }
                return item;
            });
            setAttractions(newAttraction);
        }
        else if(result.status === "Success")
        {
            setIsEditing(false);
            setNewStatus("");
            setRefreshAttractions(!refreshAttractions);

            if(confirmChanges === true)
            {
                cancelSumbitStatus(attraction_id);
            }
        }

        } catch (error) {
            console.error('Error fetching attraction:', error);
            alertShown.current = true;
            alert("Error updating attraction");
        }
    };


    const EditAttractionDescription = (attraction_id) => {
        setIsEditing(true);
        const newAttraction = attractions.map(attraction => {
            if (attraction.attraction_id === attraction_id)
            {
                attraction.is_editing_description = true;
                setNewDescription(attraction.description);
            }
            return attraction;
        });
        setAttractions(newAttraction);
    };

    const cancelEditAttractionDescription = (attraction_id) => {
        setIsEditing(false);
        setNewDescription("");
        const newAttraction = attractions.map(attraction => {
            if (attraction.attraction_id === attraction_id)
            {
                attraction.is_editing_description = false;
            }
            return attraction;
        });
        setAttractions(newAttraction);
    };

    const submitEditAttractionDescription = async (attraction_id) => {
        try {
            const dataToSend = {
                id : attraction_id,
                newDescription : newDescription
            }
            const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/updateAttractionDescription`, {
            method: 'POST',
            credentials: 'include',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend),
        });
        
        if (!response.ok) {
            throw new Error('Failed to update attraction');
        }
        
        setIsEditing(false);
        setNewDescription("");
        setRefreshAttractions(!refreshAttractions);

        } catch (error) {
            console.error('Error fetching attraction:', error);
            alertShown.current = true;
            alert("Error updating attraction");
        }
    };



    const startDeletion = (attraction_id) => {
        for(const item of attractions)
        {
            if(item.attraction_id == attraction_id)
            {
                console.log(item);
                setDeleteAttraction(item);
            }
        }
        setStep(2);
    };

    const confirmDeletion = async () => {
        try {
            const dataToSend = {
                id : deleteAttraction.attraction_id,
            }
            const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/deleteAttraction`, {
            method: 'POST',
            credentials: 'include',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend),
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete attraction');
        }
        
        
        setRefreshAttractions(!refreshAttractions);
        setStep(1);

        } catch (error) {
            console.error('Error deleting attraction:', error);
            alertShown.current = true;
            alert("Error deleting attraction");
        }
    };

    const cancelDeletion = () => {
        setDeleteAttraction(null);
        setStep(1);
    };



    return (
        <div className="profile-container">
          <h2 className='attraction-title-space'>View and update the attractions</h2>
          {step === 1 && (
          <div className="attractions-grid">
                {attractions.map((Attraction) => (
                    <div className="attraction-card" key={Attraction.attraction_id}>
                        <div className="attraction-image-container">
                           {/*} <div className="attraction-image" style={{ backgroundImage: `url(${Merchandise.image})` }}></div> */}
                        </div>
                        <div className="attraction-content">
                            <h2 className="attraction-name">{Attraction.attraction_name}</h2>
                            {Attraction.viewing_image && Attraction.mimeType ? (
                                <img 
                                    src={`data:${Attraction.mimeType};base64,${Attraction.viewing_image}`}
                                    alt="Attraction Image"
                                    className="center-image"
                                    //style={{ width: '300px', height: '300px', objectFit: 'contain' }} 
                                />
                            ) : (
                                <p>Loading Image ... </p>
                            )}
                            {Attraction.maintenanceWarning ? (
                                <>
                                <div>
                                    <h2>There is a maintenance log currently on {Attraction.attraction_name}. Do you want to close the log and open the attraction?</h2>
                                    <div /*make these buttons side by side*/>
                                        <button className="attraction-button" onClick={() => submitEditAttractionStatus(Attraction.attraction_id, true)}>Continue</button>
                                        <button className="delete-button" onClick={() => cancelSumbitStatus(Attraction.attraction_id)}>Cancel</button>
                                    </div>
                                </div>
                                </>
                            ) : (
                                <>
                               
                            {!isEditing && (
                            <button className="attraction-button" onClick={() => EditAttractionImage(Attraction.attraction_id)}>
                                Update Image
                            </button>
                            )}
                            <div className="attraction-footer">
                                <p className="attraction-text">
                                    {Attraction.description}
                                </p>
                                {!isEditing && (
                                    <button className="attraction-button" onClick={() => EditAttractionDescription(Attraction.attraction_id)}>
                                        Update Description
                                    </button>
                                )}
                            </div>
                            <div className="attraction-footer">
                                <p className="attraction-text">
                                    <strong>Status:</strong> {Attraction.attraction_status}
                                </p>
                                {!isEditing && (
                                <button className="attraction-button" onClick={() => EditAttractionStatus(Attraction.attraction_id)}>
                                    Update Status
                                </button>
                                )}
                            </div>
                            <div className="attraction-footer">
                                <div className="attraction-details">
                                    <span className="attraction-text">
                                        
                                        <><strong>Capacity:</strong> {Attraction.attraction_capacity}</>
                                        
                                    </span>
                                </div>
                                {!isEditing && (
                                <button className="attraction-button" onClick={() => EditAttractionCapacity(Attraction.attraction_id)}>
                                    Update Capacity
                                </button>
                                )}
                            </div>
                            <div className="attraction-footer">
                                <p className="attraction-text">
                                    <strong>Duration:</strong> {Attraction.attraction_duration}
                                </p>
                                {!isEditing && (
                                <button className="attraction-button" onClick={() => EditAttractionDuration(Attraction.attraction_id)}>
                                    Update Duration
                                </button>
                                )}
                            </div>
    
    
                            {Attraction.is_editing_status && (<label className="label-header"> Set Status </label>)}
                            {Attraction.is_editing_capacity && ( <label className="label-header"> Set Capacity </label> )}
                            {Attraction.is_editing_duration && ( <label className="label-header"> Set Duration </label> )}
                            {Attraction.is_editing_description && ( <label className="label-header"> Set Description </label> )}
                            {Attraction.is_editing_image && ( <label className="label-header"> Set Image </label> )}
                            <div className="attraction-footer">
                                
                                {Attraction.is_editing_capacity && (
                                    <>
                                    {/*<label className="label-header"> Set Stock Amount </label>*/}
                                    <input
                                    type="text"
                                    value={newCapacity}
                                    onChange={(e) => {
                                        let value = e.target.value.replace(/\D/g, ""); 
                                        setNewCapacity(value);
                                        //setCardHolder(onlyLetters);
                                        //checkError();
                                    }}   
                                    placeholder="Capacity"
                                    maxLength="4"
                                    minLength="1"
                                    required
                                    />
                                    {newCapacity.length > 0 && (
                                        <button className="attraction-button" onClick={() => submitEditAttractionCapacity(Attraction.attraction_id)}>
                                            Confirm Changes
                                        </button>
                                    )}
                                    <button className="attraction-button" onClick={() => cancelEditAttractionCapacity(Attraction.attraction_id) }>
                                        Cancel Changes
                                    </button>
                                    </>
                                )}
                            </div>

                            <div className="attraction-footer">
                            {Attraction.is_editing_image && (
                                <>
                                    {imagePreview && (
                                        <img 
                                            src={imagePreview}
                                            alt="Preview"
                                            className="center-image"
                                            //style={{ width: "200px", height: "200px", objectFit: "contain", marginTop: "10px" }}
                                        />
                                    )
                                    }
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="attraction_image"
                                        name="attraction_image"
                                        //value={formData.merchandise_stock}
                                        onChange= {handleImageChange}
                                        //placeholder="Amount In Stock For Merchandise"
                                        //maxLength="3"
                                        //minLength="1"
                                        //required
                                    />
                                    

                                    {newImage !== null && (
                                        <button className="attraction-button" onClick={() => submitEditAttractionImage(Attraction.attraction_id)}>
                                            Confirm Changes
                                        </button>
                                    )}
                                    <button className="attraction-button" onClick={() => cancelEditAttractionImage(Attraction.attraction_id) }>
                                        Cancel Changes
                                    </button>
                                    </>
                                )}
                            </div>

                            <div /*nothing*/>

                                {Attraction.is_editing_description && (
                                    <>
                                    {/*<label className="label-header"> Set Stock Amount </label>*/}
                                    <textarea
                                    className="description-box"
                                    value={newDescription}
                                    onChange={(e) => {
                                        setNewDescription(e.target.value);
                                    }}   
                                    placeholder="Description"
                                    maxLength="200"
                                    minLength="1"
                                    required
                                    />
                                    <div className="attraction-footer">
                                    {newDescription.length > 0 && (
                                        <button className="attraction-button" onClick={() => submitEditAttractionDescription(Attraction.attraction_id)}>
                                            Confirm Changes
                                        </button>
                                    )}
                                    <button className="attraction-button" onClick={() => cancelEditAttractionDescription(Attraction.attraction_id) }>
                                        Cancel Changes
                                    </button>
                                    </div>
                                    </>
                                )}
                            </div>

                            <div className="attraction-footer">

                            
                                {Attraction.is_editing_duration && (
                                    <>
                                    {/*<label className="label-header"> Set Stock Amount </label>*/}
                                    <input
                                    type="text"
                                    value={newDuration}
                                    onChange={ (e) => {
                                        let value = e.target.value.replace(/\D/g, ""); // Remove non-digits
                                        value = value.match(/.{1,2}/g)?.join(":") || "";
                                        value = value.slice(0, 8);
                                        setNewDuration(value);
                                        //setcard.expiration_date(value);
                                        //checkError();
                                    }}  
                                    placeholder="Duration (00:00:00)"
                                    maxLength="8"
                                    minLength="1"
                                    required
                                    />
                                    {newDuration.length === 8 && newDuration !== "00:00:00" && (
                                        <button className="attraction-button" onClick={() => submitEditAttractionDuration(Attraction.attraction_id)}>
                                            Confirm Changes
                                        </button>
                                    )}
                                    <button className="attraction-button" onClick={() => cancelEditAttractionDuration(Attraction.attraction_id) }>
                                        Cancel Changes
                                    </button>
                                    </>
                                )}
                            </div>
                            <div className="attraction-footer">
    
                                {Attraction.is_editing_status && (
                                    <>
                                    {/*<label className="label-header"> Set Price </label>*/}
                                    <select 
                                    className="custom-select"
                                    //className="form-input"
                                    value={newStatus}
                                    onChange={(e) => {
                                        setNewStatus(e.target.value);
                                    }}
                                    required
                                    >
                                        <option value="">Select Status</option>
                                        <option value="Open">Open</option>
                                        <option value="Closed">Closed</option>
                                    </select>
                                    {newStatus !== "" && (
                                        <button className="attraction-button" onClick={() => submitEditAttractionStatus(Attraction.attraction_id, false)}>
                                            Confirm Changes
                                        </button>
                                    )}
                                    <button className="attraction-button" onClick={() => cancelEditAttractionStatus(Attraction.attraction_id) }>
                                        Cancel Changes
                                    </button>
                                    </>
                                )}
                            </div>
                            {!isEditing && (
                            <button className="delete-button" onClick={() => startDeletion(Attraction.attraction_id)}>
                                Delete Attraction
                            </button>
                            )}
                            </>
                            )}
                        </div>
                        
                        
                    </div>
                ))}
            </div>
            )}
    
            {step === 2 && (
                <div /*center this */>
                {deleteAttraction === null ? (
                    <>
                    <p className="attraction-name">Error Gathering Attraction Information</p>
                    <button className="delete-button" onClick={() => setStep(1)}>Go back</button>
                    </>
                ): (
                    <>
                    <div>
                        <h2>Are you sure you want to DELETE <span /*make this text colored red*/>{deleteAttraction.attraction_name}</span></h2>
                        <div /*make these buttons side by side*/>
                            <button className="attraction-button" onClick={() => confirmDeletion()}>Confirm Deletion</button>
                            <button className="delete-button" onClick={() => cancelDeletion()}>Cancel Deletion</button>
                        </div>
                    </div>
                    </>
                )}
                </div>
            )}
          {/*<button onClick={() => setActiveTab('dashboard')}>Back to Dashboard</button>*/}
        </div>
      );
};

export default HandleAttraction;
