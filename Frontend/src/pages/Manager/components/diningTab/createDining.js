import React, { useState, useRef, useEffect } from 'react';
import "../../../../App.css";

const CreateDining = ({ setInnerActiveTab }) => {
    const alertShown = useRef(false);
    const [formData, setFormData] = useState({
        dining_name : "",
        dining_status : "",
        dining_description : "",
        dining_image : null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState('');

    

    useEffect(() => {
        checkError();
    }, [formData]);

    function checkError(){
        if(formData.dining_name == "")
        {
            setError("Enter a name for the dining");
            return false;
        }
        if(formData.dining_description == "")
        {
            setError("Enter the description for the dining");
            return false;
        }
        if(formData.dining_status == "")
        {
            setError("Enter the status for the dining");
            return false;
        }
        if(formData.dining_image == null)
        {
            setError("Enter an image of the dining");
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
                    name : formData.dining_name,
                    description : formData.dining_description,
                    status : formData.dining_status,
                    image : base64String
                }

                const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/createDining`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend),
                });

                
                if (!response.ok) {
                    throw new Error('Failed to create dining');
                }
                const data = await response.json();
                if (data.success) {
                    setInnerActiveTab('handleDining')
                    
                }
            } catch (error) {
                console.log(`Error creating dining: ${error}`)
                console.error('Error creating dining:', error);
                alertShown.current = true;
                alert("Error creating dining ");
            }
        };

        const reader = new FileReader();
        reader.readAsDataURL(formData.dining_image);
        reader.onload = () => {
            const base64String = reader.result.split(',')[1]; // Remove metadata prefix
            submitData(base64String);
        };

    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]; // Get selected file
        setFormData({ ...formData, dining_image: file });
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
            <label htmlFor="attraction_name">Dining Name</label>
            <input
                type="text"
                id="attraction_name"
                name="attraction_name"
                value={formData.dining_name || ''}
                onChange={(e) => {
                    //const onlyLettersAndSpaces = e.target.value.replace(/[^a-zA-Z\s]/g, ""); // Allow letters and spaces
                    setFormData({ ...formData, dining_name: e.target.value });
                }} 
                placeholder="Dining Name"
                maxLength="100"
                minLength="1"
                required
            />
            </div>

            <div className="form-group">
            <label htmlFor="attraction_description">Dining Description</label>
            <textarea
                className="description-box"
                id="attraction_description"
                name="attraction_description"
                value={formData.dining_description || ''}
                onChange={(e) => {
                    setFormData({ ...formData, dining_description: e.target.value });
                }}   
                placeholder="Description"
                maxLength="200"
                minLength="1"
                required
            />
            </div>

    

            <div className="form-group">
            <label htmlFor="attraction_status">Dining Status</label>
            <select 
                id="attraction_status"
                name="attraction_status"
                //className="custom-select"
                //className="form-input"
                value={formData.dining_status || ''}
                onChange={(e) => {
                    setFormData({ ...formData, dining_status: e.target.value });
                }}
                required
            >
                <option value="">Select Status</option>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
            </select>
            </div>

            <div className="form-group">
            <label htmlFor="attraction_image">Image For Dining</label>
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
                    Create Dining
                </button>
            )}
            
            <button 
                type="button" 
                className="delete-button" 
                onClick={() => setInnerActiveTab('handleMerchandise')}
            >
                Cancel
            </button>
            </div> 
        </div>
        </div>
    );
};

export default CreateDining;