import React, { useState, useRef, useEffect } from 'react';
import "../../../../App.css";

const CreateMerchandise = ({ setInnerActiveTab }) => {
    const alertShown = useRef(false);
    const [merchandises, setMerchandises] = useState([]);
    const [formData, setFormData] = useState({
        merchandise_name : "",
        merchandise_price : "",
        merchandise_stock : "",
        merchandise_image : null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [refreshMerchandise, setRefreshMerchandise] = useState(false);
    const [error, setError] = useState('');
    //const [attractions, setAttractions] = useState([]);
    //const [loading, setLoading] = useState(true);
    //const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMerchandise = async () => {
            try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/getMerchandise`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch merchandise');
            }
            
            const data = await response.json();
            if (data.success) {
                //setEmployees(data.data);
                setMerchandises(data.data);
                console.log(data.data);

                //console.log(merch);
                
            }
            } catch (error) {
            console.error('Error fetching merchandise:', error);
            }
        };

        fetchMerchandise();
        
    }, [refreshMerchandise]);

    useEffect(() => {
        checkError();
    }, [formData]);

    function checkError(){
        if(formData.merchandise_name == "")
        {
            setError("Enter a name for the merchandise");
            return false;
        }
        if(formData.merchandise_price == "")
        {
            setError("Enter a price for the merchandise");
            return false;
        }
        if(formData.merchandise_stock == "")
        {
            setError("Enter the amount in stock");
            return false;
        }
        if(formData.merchandise_image == null)
        {
            setError("Enter an image of the merchandise");
            return false;
        }
        console.log(formData.merchandise_image);
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
                    name : formData.merchandise_name,
                    price : Number(formData.merchandise_price),
                    stock : Number(formData.merchandise_stock),
                    image : base64String
                }

                const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/createMerchandise`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend),
                });

                
                if (!response.ok) {
                    throw new Error('Failed to create merchandise');
                }
                const data = await response.json();
                if (data.success) {
                    setInnerActiveTab('handleMerchandise')
                    
                }
            } catch (error) {
                console.log(`Error creating merchandise: ${error}`)
                console.error('Error creating merchandise:', error);
                alertShown.current = true;
                alert("Error creating merchandise ");
            }
        };

        const reader = new FileReader();
        reader.readAsDataURL(formData.merchandise_image);
        reader.onload = () => {
            const base64String = reader.result.split(',')[1]; // Remove metadata prefix
            submitData(base64String);
        };

    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]; // Get selected file
        setFormData({ ...formData, merchandise_image: file });
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
        <h2 className='attraction-title-space'>Create New Merchandise</h2>
        
        <div /*onSubmit={handleSubmit}*/ className="employee-form">
            <div className="form-group">
            <label htmlFor="merchandise_name">Merchandise Name</label>
            <input
                type="text"
                id="merchandise_name"
                name="merchandise_name"
                value={formData.merchandise_name || ''}
                onChange={(e) => {
                    //const onlyLettersAndSpaces = e.target.value.replace(/[^a-zA-Z\s]/g, ""); // Allow letters and spaces
                    setFormData({ ...formData, merchandise_name: e.target.value });
                }} 
                placeholder="Merchandise Name"
                maxLength="100"
                minLength="1"
                required
            />
            </div>

            <div className="form-group">
            <label htmlFor="merchandise_price">Price</label>
            <input
                type="text"
                id="merchandise_price"
                name="merchandise_price"
                value={formData.merchandise_price || ''}
                onChange={(e) => {
                    let digitsOnly = e.target.value.replace(/\D/g, ""); 
                    setFormData({ ...formData, merchandise_price: digitsOnly });
                }} 
                placeholder="Price For Merchandise"
                maxLength="3"
                minLength="1"
                required
            />
            </div>

            <div className="form-group">
            <label htmlFor="merchandise_stock">Amount In Stock</label>
            <input
                type="text"
                id="merchandise_stock"
                name="merchandise_stock"
                value={formData.merchandise_stock || ''}
                onChange={(e) => {
                    let digitsOnly = e.target.value.replace(/\D/g, ""); 
                    setFormData({ ...formData, merchandise_stock: digitsOnly });
                }} 
                placeholder="Amount In Stock For Merchandise"
                maxLength="3"
                minLength="1"
                required
            />
            </div>

            <div className="form-group">
            <label htmlFor="merchandise_image">Image For Merchandise</label>
            <input
                type="file"
                accept="image/*"
                id="merchandise_image"
                name="merchandise_image"
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
                    Create Merchandise
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

export default CreateMerchandise;