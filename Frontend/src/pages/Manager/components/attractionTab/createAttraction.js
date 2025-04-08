import React, { useState, useRef, useEffect } from 'react';
import "./Attraction.css";

const CreateAttraction = ({ setInnerActiveTab }) => {
    const alertShown = useRef(false);
    const [formData, setFormData] = useState({
        attraction_name : "",
        attraction_capacity : "",
        attraction_duration : "",
        attraction_status : "",
        attraction_description : "",
        attraction_image : null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState('');

    

    useEffect(() => {
        checkError();
    }, [formData]);

    function checkError(){
        if(formData.attraction_name == "")
        {
            setError("Enter a name for the attraction");
            return false;
        }
        if(formData.attraction_description == "")
        {
            setError("Enter the description for the attraction");
            return false;
        }
        if(formData.attraction_capacity == "")
        {
            setError("Enter the capacity for the attraction");
            return false;
        }
        if(formData.attraction_duration.length <  8)
        {
            setError("Enter the duration for the attraction");
            return false;
        }
        if(formData.attraction_status == "")
        {
            setError("Enter the status for the attraction");
            return false;
        }
        if(formData.attraction_image == null)
        {
            setError("Enter an image of the attraction");
            return false;
        }
        setError("");
        return true;
    }
   

    const  handleSubmit = async () => {
        //setRefreshMerchandise(!refreshMerchandise);
        //I might add a check to see if the name already exists
        const submitData = async (base64String) => {
            try {
                if (!base64String) {
                    throw new Error('No Image');
                }//else {throw new Error('No Image');}

                console.log(base64String);
                const dataToSend = {
                    name : formData.attraction_name,
                    capacity : Number(formData.attraction_capacity),
                    duration : formData.attraction_duration,
                    description : formData.attraction_description,
                    status : formData.attraction_status,
                    image : base64String
                }

                const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/createAttraction`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend),
                });

                
                if (!response.ok) {
                    throw new Error('Failed to create attraction');
                }
                const data = await response.json();
                if (data.success) {
                    setInnerActiveTab('handleAttractions')
                    
                }
            } catch (error) {
                console.log(`Error creating attraction: ${error}`)
                console.error('Error creating attraction:', error);
                alertShown.current = true;
                alert("Error creating attraction ");
            }
        };

        const reader = new FileReader();
        reader.readAsDataURL(formData.attraction_image);
        reader.onload = () => {
            const base64String = reader.result.split(',')[1]; // Remove metadata prefix
            submitData(base64String);
        };

    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]; // Get selected file
        setFormData({ ...formData, attraction_image: file });
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file); // Convert file to Base64
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
        }
    };
    
    return (
        <div className="employee-form-container">
        

        <h2 className='attraction-title-space'>Create New Attraction</h2>
        
        <div /*onSubmit={handleSubmit}*/ className="employee-form">
            <div className="form-group">
            <label htmlFor="attraction_name">Attraction Name</label>
            <input
                type="text"
                id="attraction_name"
                name="attraction_name"
                value={formData.attraction_name || ''}
                onChange={(e) => {
                    //const onlyLettersAndSpaces = e.target.value.replace(/[^a-zA-Z\s]/g, ""); // Allow letters and spaces
                    setFormData({ ...formData, attraction_name: e.target.value });
                }} 
                placeholder="Attraction Name"
                maxLength="50"
                minLength="1"
                required
            />
            </div>

            <div className="form-group">
            <label htmlFor="attraction_description">Attraction Description</label>
            <textarea
                className="description-box"
                id="attraction_description"
                name="attraction_description"
                value={formData.attraction_description || ''}
                onChange={(e) => {
                    setFormData({ ...formData, attraction_description: e.target.value });
                }}   
                placeholder="Description"
                maxLength="200"
                minLength="1"
                required
            />
            </div>

            <div className="form-group">
            <label htmlFor="attraction_capacity">Attraction Capacity</label>
            <input
                type="text"
                id="attraction_capacity"
                name="attraction_capacity"
                value={formData.attraction_capacity || ''}
                onChange={(e) => {
                    let digitsOnly = e.target.value.replace(/\D/g, ""); 
                    setFormData({ ...formData, attraction_capacity: digitsOnly });
                }} 
                placeholder="Capacity For Attraction"
                maxLength="4"
                minLength="1"
                required
            />
            </div>


            <div className="form-group">
            <label htmlFor="attraction_duration">Attraction Duration</label>
            <input
                type="text"
                id="attraction_duration"
                name="attraction_duration"
                value={formData.attraction_duration || ''}
                onChange={ (e) => {
                    let value = e.target.value.replace(/\D/g, ""); // Remove non-digits
                    value = value.match(/.{1,2}/g)?.join(":") || "";
                    value = value.slice(0, 8);
                    setFormData({ ...formData, attraction_duration: value });
                }}  
                placeholder="Attraction Duration (00:00:00)"
                maxLength="8"
                minLength="1"
                required
            />
            </div>

            <div className="form-group">
            <label htmlFor="attraction_status">Attraction Status</label>
            <select 
                id="attraction_status"
                name="attraction_status"
                //className="custom-select"
                //className="form-input"
                value={formData.attraction_status || ''}
                onChange={(e) => {
                    setFormData({ ...formData, attraction_status: e.target.value });
                }}
                required
            >
                <option value="">Select Status</option>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
            </select>
            </div>

            <div className="form-group">
            <label htmlFor="attraction_image">Image For Attraction</label>
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
            {imagePreview && (
                <img 
                    src={imagePreview}
                    alt="Preview"
                    style={{ width: "200px", height: "200px", objectFit: "contain", marginTop: "10px" }}
                />
            )
            }
            </div>
            
            
            <div className="error-container">
            {error !== "" ? (
                <p className="error-message">{error}</p>
            ) : (
                <button /*type="submit"*/ onClick={() => handleSubmit()} className="submit-btn">
                    Create Attraction
                </button>
            )}
            
            <button 
                type="button" 
                className="delete-button" 
                onClick={() => setInnerActiveTab('handleAttractions')}
            >
                Cancel
            </button>
            </div> 
        </div>
        </div>
    );
};

export default CreateAttraction;