import React, { useEffect, useState, useRef } from "react";
import "../../../../App.css";


const HandleDining = ({ setActiveTab }) => {
    const alertShown = useRef(false);

    const [isEditing, setIsEditing] = useState(false);;
    const [step, setStep] = useState(1);

    const [dining, setDining] = useState([]);
    const [refreshDining, setRefreshDining] = useState(false);
    const [newStatus, setNewStatus] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [deleteDining, setDeleteDining] = useState(null);

    const [newImage, setNewImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);


    
    useEffect(() => {
        const fetchDining = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/getDining`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                    });
                if (!response.ok) {
                    throw new Error('Failed to fetch dining');
                }
                const result = await response.json();

                if (result.success) {
                    const dinings = result.data.map((dining,index) => {
                        return {
                            ...dining,
                            is_editing_status : false,
                            is_editing_description : false,
                            is_editing_image : false,
                            maintenanceWarning : false
                        };
                    });
                    setDining(dinings);
                } else {
                    throw new Error(result.message || 'Failed to fetch dining');
                }
            } catch (error) {
                console.error('Error fetching dining:', error);
                //setError(error.message);
            } 
        };

        fetchDining();
    }, [refreshDining]);


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

    const EditDiningImage = (dining_id) => {
        setIsEditing(true);
        setNewImage(null);
        setImagePreview(null);
        const newDining = dining.map(item => {
            if (item.dining_id === dining_id)
            {
                item.is_editing_image = true;
            }
            return item;
        });
        setDining(newDining);
    };

    const cancelEditDiningImage = (dining_id) => {
        setIsEditing(false);
        setNewImage(null);
        setImagePreview(null);
        const newDining = dining.map(item => {
            if (item.dining_id === dining_id)
            {
                item.is_editing_image = false;
            }
            return item;
        });
        setDining(newDining);
    };

    const submitEditDiningImage = async (dining_id) => {
        const submitImage = async (base64String) => {
            try {
                if (!base64String) {
                    throw new Error('No Image');
                }
                const dataToSend = {
                    id : dining_id,
                    newImage : base64String
                }
                const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/updateDiningImage`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend),
            });
            
            if (!response.ok) {
                throw new Error('Failed to update dining');
            }
            
            setIsEditing(false);
            setNewImage(null);
            setImagePreview(null);
            setRefreshDining(!refreshDining);

            } catch (error) {
                console.error('Error fetching dining:', error);
                alertShown.current = true;
                alert("Error updating dining");
            }
        }

        const reader = new FileReader();
        reader.readAsDataURL(newImage);
        reader.onload = () => {
            const base64String = reader.result.split(',')[1]; // Remove metadata prefix
            submitImage(base64String);
        };
        

    }

    

    const EditDiningStatus = (dining_id) => {
        setIsEditing(true);
        const newDining = dining.map(item => {
            if (item.dining_id === dining_id)
            {
                item.is_editing_status = true;
            }
            return item;
        });
        setDining(newDining);
    };

    const cancelEditDiningStatus = (dining_id) => {
        setIsEditing(false);
        setNewStatus("");
        const newDining = dining.map(item => {
            if (item.dining_id === dining_id)
            {
                item.is_editing_status = false;
            }
            return item;
        });
        setDining(newDining);
    };

    const cancelSumbitStatus = (dining_id) => {
        const newDining = dining.map(item => {
            if (item.dining_id === dining_id)
            {
                item.maintenanceWarning = false;
            }
            return item;
        });
        setDining(newDining);
    }

    const submitEditDiningStatus = async (dining_id, confirmChanges) => {
        try {
            const dataToSend = {
                id : dining_id,
                newStatus : newStatus,
                confirmChanges : confirmChanges
            }
            const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/updateDiningStatus`, {
            method: 'POST',
            credentials: 'include',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend),
        });
        
        if (!response.ok) {
            throw new Error('Failed to update dining');
        }

        const result = await response.json();
        if(result.status === "Blocked")
        {
            //setMaintenanceWarning(true);
            const newDining = dining.map(item => {
                if (item.dining_id === dining_id)
                {
                    item.maintenanceWarning = true;
                }
                return item;
            });
            setDining(newDining);
        }
        else if(result.status === "Success")
        {
            setIsEditing(false);
            setNewStatus("");
            setRefreshDining(!refreshDining);

            if(confirmChanges === true)
            {
                cancelSumbitStatus(dining_id);
            }
        }
        


        } catch (error) {
            console.error('Error fetching dining:', error);
            alertShown.current = true;
            alert("Error updating dining");
        }
    };


    const EditDiningDescription = (dining_id) => {
        setIsEditing(true);
        const newDining = dining.map(item => {
            if (item.dining_id === dining_id)
            {
                item.is_editing_description = true;
                setNewDescription(item.dining_description);
            }
            return item;
        });
        setDining(newDining);
    };

    const cancelEditDiningDescription = (dining_id) => {
        setIsEditing(false);
        setNewDescription("");
        const newDining = dining.map(item => {
            if (item.dining_id === dining_id)
            {
                item.is_editing_description = false;
            }
            return item;
        });
        setDining(newDining);
    };

    const submitEditDiningDescription = async (dining_id) => {
        try {
            const dataToSend = {
                id : dining_id,
                newDescription : newDescription
            }
            const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/updateDiningDescription`, {
            method: 'POST',
            credentials: 'include',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend),
        });
        
        if (!response.ok) {
            throw new Error('Failed to update dining');
        }
        
        setIsEditing(false);
        setNewDescription("");
        setRefreshDining(!refreshDining);

        } catch (error) {
            console.error('Error fetching dining:', error);
            alertShown.current = true;
            alert("Error updating dining");
        }
    };



    const startDeletion = (dining_id) => {
        for(const item of dining)
        {
            if(item.dining_id == dining_id)
            {
                console.log(item);
                setDeleteDining(item);
            }
        }
        setStep(2);
    };

    const confirmDeletion = async () => {
        try {
            const dataToSend = {
                id : deleteDining.dining_id,
            }
            const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/deleteDining`, {
            method: 'POST',
            credentials: 'include',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend),
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete dining');
        }
        
        
        setRefreshDining(!refreshDining);
        setStep(1);

        } catch (error) {
            console.error('Error deleting dining:', error);
            alertShown.current = true;
            alert("Error deleting dining");
        }
    };

    const cancelDeletion = () => {
        setDeleteDining(null);
        setStep(1);
    };



    return (
        <div className="profile-container">
          <h2 className='attraction-title-space'>View and update the dinings</h2>
          {step === 1 && (
          <div className="attractions-grid">
                {dining.map((dining_item) => (
                    <div className="attraction-card" key={dining_item.dining_id}>
                        <div className="attraction-image-container">
                           {/*} <div className="attraction-image" style={{ backgroundImage: `url(${Merchandise.image})` }}></div> */}
                        </div>
                        <div className="attraction-content">
                            <h2 className="attraction-name">{dining_item.dining_name}</h2>
                            {dining_item.viewing_image && dining_item.mimeType ? (
                                <img 
                                    src={`data:${dining_item.mimeType};base64,${dining_item.viewing_image}`}
                                    className="center-image"
                                    alt="Attraction Image"
                                    //style={{ width: '300px', height: '300px', objectFit: 'contain' }} 
                                />
                            ) : (
                                <p>Loading Image ... </p>
                            )}
                            {dining_item.maintenanceWarning ? (
                                <>
                                <div>
                                    <h2>There is a maintenance log currently on {dining_item.dining_name}. Do you want to close the log and open the dining facility?</h2>
                                    <div /*make these buttons side by side*/>
                                        <button className="attraction-button" onClick={() => submitEditDiningStatus(dining_item.dining_id, true)}>Continue</button>
                                        <button className="delete-button" onClick={() => cancelSumbitStatus(dining_item.dining_id)}>Cancel</button>
                                    </div>
                                </div>
                                </>
                            ) : (
                                <>
                            {!isEditing && (
                            <button className="attraction-button" onClick={() => EditDiningImage(dining_item.dining_id)}>
                                Update Image
                            </button>
                            )}
                            <div className="attraction-footer">
                                <p className="attraction-text">
                                    {dining_item.dining_description}
                                </p>
                            </div>
                            {!isEditing && (
                                <button className="attraction-button" onClick={() => EditDiningDescription(dining_item.dining_id)}>
                                    Update Description
                                </button>
                            )}
                            <div className="attraction-footer">
                                <p className="attraction-text"><strong>Status:</strong> {dining_item.dining_status}</p>
                                {!isEditing && (
                                <button className="attraction-button" onClick={() => EditDiningStatus(dining_item.dining_id)}>
                                    Update Status
                                </button>
                                )}
                            </div>
                    
  
                            {dining_item.is_editing_status && (<label className="label-header"> Set Status </label>)}
                            {dining_item.is_editing_description && ( <label className="label-header"> Set Description </label> )}
                            {dining_item.is_editing_image && ( <label className="label-header"> Set Image </label> )}

                            <div className="attraction-footer">
                            {dining_item.is_editing_image && (
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
                                        id="dining_image"
                                        name="dining_image"
                                        //value={formData.merchandise_stock}
                                        onChange= {handleImageChange}
                                        //placeholder="Amount In Stock For Merchandise"
                                        //maxLength="3"
                                        //minLength="1"
                                        //required
                                    />
                                    

                                    {newImage !== null && (
                                        <button className="attraction-button" onClick={() => submitEditDiningImage(dining_item.dining_id)}>
                                            Confirm Changes
                                        </button>
                                    )}
                                    <button className="attraction-button" onClick={() => cancelEditDiningImage(dining_item.dining_id) }>
                                        Cancel Changes
                                    </button>
                                    </>
                                )}
                            </div>

                            <div /*nothing*/>

                                {dining_item.is_editing_description && (
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
                                        <button className="attraction-button" onClick={() => submitEditDiningDescription(dining_item.dining_id)}>
                                            Confirm Changes
                                        </button>
                                    )}
                                    <button className="attraction-button" onClick={() => cancelEditDiningDescription(dining_item.dining_id) }>
                                        Cancel Changes
                                    </button>
                                    </div>
                                    </>
                                )}
                            </div>

                            <div className="attraction-footer">
    
                                {dining_item.is_editing_status && (
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
                                        <button className="attraction-button" onClick={() => submitEditDiningStatus(dining_item.dining_id, false)}>
                                            Confirm Changes
                                        </button>
                                    )}
                                    <button className="attraction-button" onClick={() => cancelEditDiningStatus(dining_item.dining_id) }>
                                        Cancel Changes
                                    </button>
                                    </>
                                )}
                            </div>
                            {!isEditing && (
                            <button className="delete-button" onClick={() => startDeletion(dining_item.dining_id)}>
                                Delete Dining
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
                {deleteDining === null ? (
                    <>
                    <p className="attraction-name">Error Gathering Dining Information</p>
                    <button className="delete-button" onClick={() => setStep(1)}>Go back</button>
                    </>
                ): (
                    <>
                    <div>
                        <h2>Are you sure you want to DELETE <span /*make this text colored red*/>{deleteDining.dining_name}</span></h2>
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

export default HandleDining;
