import React, { useEffect, useState, useRef } from "react";
import "../../../App.css";


const HandleMerchandise = ({ setActiveTab }) => {
    const alertShown = useRef(false);
    const [merchandises, setMerchandises] = useState([]);
    const [refreshMerchandise, setRefreshMerchandise] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newStockAmount, setNewStockAmount] = useState("");
    const [step, setStep] = useState(1);
    const [newPrice, setNewPrice] = useState("");
    const [deleteMerch, setDeleteMerch] = useState(null);

    const [newImage, setNewImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);


    

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
                const merch = data.data.map((item,index) => {
                    return {
                        ...item,
                        is_editing_stock : false,
                        is_editing_price : false,
                        is_editing_image : false
                    };
                });

                setMerchandises(merch);
                console.log(merch);

                //console.log(merch);
                
            }
            } catch (error) {
            console.error('Error fetching merchandise:', error);
            }
        };

        fetchMerchandise();
        
    }, [refreshMerchandise]);


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

    const EditMerchandiseImage = (merchandise_id) => {
        setIsEditing(true);
        setNewImage(null);
        setImagePreview(null);
        const newMerchandise = merchandises.map(item => {
            if (item.merchandise_id === merchandise_id)
            {
                item.is_editing_image = true;
            }
            return item;
        });
        setMerchandises(newMerchandise);
    };

    const cancelEditMerchandiseImage = (merchandise_id) => {
        setIsEditing(false);
        setNewImage(null);
        setImagePreview(null);
        const newMerchandise = merchandises.map(item => {
            if (item.merchandise_id === merchandise_id)
            {
                item.is_editing_image = false;
            }
            return item;
        });
        setMerchandises(newMerchandise);
    };

    const submitEditMerchandiseImage = async (merchandise_id) => {
        const submitImage = async (base64String) => {
            try {
                if (!base64String) {
                    throw new Error('No Image');
                }
                const dataToSend = {
                    id : merchandise_id,
                    newImage : base64String
                }
                const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/updateMerchandiseImage`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend),
            });
            
            if (!response.ok) {
                throw new Error('Failed to update merchandise');
            }
            
            setIsEditing(false);
            setNewImage(null);
            setImagePreview(null);
            /*
            const newMerchandise = merchandises.map(item => {
                if (item.merchandise_id === merchandise_id)
                {
                    item.is_editing_stock = false;
                }
                return item;
            });
            setMerchandises(newMerchandise);*/
            setRefreshMerchandise(!refreshMerchandise);

            } catch (error) {
                console.error('Error fetching merchandise:', error);
                alertShown.current = true;
                alert("Error updating merchandise");
            }
        }

        const reader = new FileReader();
        reader.readAsDataURL(newImage);
        reader.onload = () => {
            const base64String = reader.result.split(',')[1]; // Remove metadata prefix
            submitImage(base64String);
        };
        

    }

    const EditMerchandiseStock = (merchandise_id) => {
        setIsEditing(true);
        const newMerchandise = merchandises.map(item => {
            if (item.merchandise_id === merchandise_id)
            {
                item.is_editing_stock = true;
            }
            return item;
        });
        setMerchandises(newMerchandise);
    };

    const cancelEditMerchandiseStock = (merchandise_id) => {
        setIsEditing(false);
        setNewStockAmount("");
        const newMerchandise = merchandises.map(item => {
            if (item.merchandise_id === merchandise_id)
            {
                item.is_editing_stock = false;
            }
            return item;
        });
        setMerchandises(newMerchandise);
    };

    const submitEditMerchandiseStock = async (merchandise_id) => {
        try {
            const dataToSend = {
                id : merchandise_id,
                newStock : Number(newStockAmount)
            }
            const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/updateMerchandiseStock`, {
            method: 'POST',
            credentials: 'include',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend),
        });
        
        if (!response.ok) {
            throw new Error('Failed to update merchandise');
        }
        
        setIsEditing(false);
        setNewStockAmount("");
        /*
        const newMerchandise = merchandises.map(item => {
            if (item.merchandise_id === merchandise_id)
            {
                item.is_editing_stock = false;
            }
            return item;
        });
        setMerchandises(newMerchandise);*/
        setRefreshMerchandise(!refreshMerchandise);

        } catch (error) {
            console.error('Error fetching merchandise:', error);
            alertShown.current = true;
            alert("Error updating merchandise");
        }
        

    }

    const EditMerchandisePrice = (merchandise_id) => {
        setIsEditing(true);
        const newMerchandise = merchandises.map(item => {
            if (item.merchandise_id === merchandise_id)
            {
                item.is_editing_price = true;
            }
            return item;
        });
        setMerchandises(newMerchandise);
    };

    const cancelEditMerchandisePrice = (merchandise_id) => {
        setIsEditing(false);
        setNewPrice("");
        const newMerchandise = merchandises.map(item => {
            if (item.merchandise_id === merchandise_id)
            {
                item.is_editing_price = false;
            }
            return item;
        });
        setMerchandises(newMerchandise);
    };

    const submitEditMerchandisePrice = async (merchandise_id) => {
        try {
            const dataToSend = {
                id : merchandise_id,
                newPrice : Number(newPrice)
            }
            const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/updateMerchandisePrice`, {
            method: 'POST',
            credentials: 'include',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend),
        });
        
        if (!response.ok) {
            throw new Error('Failed to update merchandise');
        }
        
        setIsEditing(false);
        setNewPrice("");
        /*
        const newMerchandise = merchandises.map(item => {
            if (item.merchandise_id === merchandise_id)
            {
                item.is_editing_stock = false;
            }
            return item;
        });
        setMerchandises(newMerchandise);*/
        setRefreshMerchandise(!refreshMerchandise);

        } catch (error) {
            console.error('Error fetching merchandise:', error);
            alertShown.current = true;
            alert("Error updating merchandise");
        }
        

    }

    const startDeletion = (merchandise_id) => {
        for(const item of merchandises)
        {
            if(item.merchandise_id == merchandise_id)
            {
                console.log(item);
                setDeleteMerch(item);
            }
        }
        setStep(2);
    };

    const confirmDeletion = async () => {
        try {
            const dataToSend = {
                id : deleteMerch.merchandise_id,
            }
            const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/deleteMerchandise`, {
            method: 'POST',
            credentials: 'include',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend),
        });
        
        if (!response.ok) {
            throw new Error('Failed to update merchandise');
        }
        
        
        setRefreshMerchandise(!refreshMerchandise);
        setStep(1);

        } catch (error) {
            console.error('Error fetching merchandise:', error);
            alertShown.current = true;
            alert("Error deleting merchandise");
        }
    };

    const cancelDeletion = () => {
        setDeleteMerch(null);
        setStep(1);
    };



  return (
    <div className="profile-container">
      <h2>Online Store Merchandise</h2>
      <p>View and update your merchandise information here.</p>
      {step === 1 && (
      <div className="attractions-grid">
            {merchandises.map((Merchandise) => (
                <div className="attraction-card" key={Merchandise.merchandise_id}>
                    <div className="attraction-image-container">
                       {/*} <div className="attraction-image" style={{ backgroundImage: `url(${Merchandise.image})` }}></div> */}
                    </div>
                    <div className="attraction-content">
                        <h2 className="attraction-name">{Merchandise.merchandise_name}</h2>
                        {Merchandise.viewing_image && Merchandise.mimeType ? (
                            <img 
                                src={`data:${Merchandise.mimeType};base64,${Merchandise.viewing_image}`}
                                alt="Merchandise Image"
                                className="center-image"
                                //style={{ width: '300px', height: '300px', objectFit: 'contain' }} 
                            />
                        ) : (
                            <p>Loading Image ... </p>
                        )}
                        {!isEditing && (
                            <button className="attraction-button" onClick={() => EditMerchandiseImage(Merchandise.merchandise_id)}>
                                Update Image
                            </button>
                            )}
                        <div className="attraction-footer">
                            <p className="attraction-description"> <strong>Price:</strong> ${Merchandise.merchandise_price} USD</p>
                            {!isEditing && (
                            <button className="attraction-button" onClick={() => EditMerchandisePrice(Merchandise.merchandise_id)}>
                                Update Price
                            </button>
                            )}
                        </div>
                        <div className="attraction-footer">
                            <div className="attraction-details">
                                <span className="attraction-detail">
                                    
                                    <><strong>Stock Amount:</strong> {Merchandise.stock_amount}</>
                                    
                                </span>
                                <span className="attraction-detail">
                                {/*}   {Merchandise.in_shopping_cart > 0 && (
                                        <><strong>Amount In Shopping Cart:</strong> {Merchandise.in_shopping_cart}</>
                                    )}*/}
                                </span>
                            </div>
                            {!isEditing && (
                            <button className="attraction-button" onClick={() => EditMerchandiseStock(Merchandise.merchandise_id)}>
                                Update Stock Amount
                            </button>
                            )}
                        </div>


                        {Merchandise.is_editing_price && (<label className="label-header"> Set Price </label>)}
                        {Merchandise.is_editing_stock && ( <label className="label-header"> Set Stock Amount </label> )}
                        {Merchandise.is_editing_stock && ( <label className="label-header"> Set Image </label> )}
                        <div className="attraction-footer">
                            {Merchandise.is_editing_image && (
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
                                    id="merchandise_image"
                                    name="merchandise_image"
                                    //value={formData.merchandise_stock}
                                    onChange= {handleImageChange}
                                    //placeholder="Amount In Stock For Merchandise"
                                    //maxLength="3"
                                    //minLength="1"
                                    //required
                                />
                                

                                {newImage !== null && (
                                    <button className="attraction-button" onClick={() => submitEditMerchandiseImage(Merchandise.merchandise_id)}>
                                        Confirm Changes
                                    </button>
                                )}
                                <button className="attraction-button" onClick={() => cancelEditMerchandiseImage(Merchandise.merchandise_id) }>
                                    Cancel Changes
                                </button>
                                </>
                            )}
                            {Merchandise.is_editing_stock && (
                                <>
                                {/*<label className="label-header"> Set Stock Amount </label>*/}
                                <input
                                type="text"
                                value={newStockAmount}
                                onChange={(e) => {
                                    let value = e.target.value.replace(/\D/g, ""); 
                                    setNewStockAmount(value);
                                    //setCardHolder(onlyLetters);
                                    //checkError();
                                }}   
                                placeholder="Stock Amount"
                                maxLength="3"
                                minLength="1"
                                required
                                />
                                {newStockAmount.length > 0 && (
                                    <button className="attraction-button" onClick={() => submitEditMerchandiseStock(Merchandise.merchandise_id)}>
                                        Confirm Changes
                                    </button>
                                )}
                                <button className="attraction-button" onClick={() => cancelEditMerchandiseStock(Merchandise.merchandise_id) }>
                                    Cancel Changes
                                </button>
                                </>
                            )}
                        

                        
                            
                            {Merchandise.is_editing_price && (
                                <>
                                {/*<label className="label-header"> Set Price </label>*/}
                                <input
                                type="text"
                                value={newPrice}
                                onChange={(e) => {
                                    let value = e.target.value.replace(/\D/g, ""); 
                                    setNewPrice(value);
                                    //setCardHolder(onlyLetters);
                                    //checkError();
                                }}   
                                placeholder="Price"
                                maxLength="3"
                                minLength="1"
                                required
                                />
                                {newPrice.length > 0 && (
                                    <button className="attraction-button" onClick={() => submitEditMerchandisePrice(Merchandise.merchandise_id)}>
                                        Confirm Changes
                                    </button>
                                )}
                                <button className="attraction-button" onClick={() => cancelEditMerchandisePrice(Merchandise.merchandise_id) }>
                                    Cancel Changes
                                </button>
                                </>
                            )}
                        </div>
                    </div>
                    <button className="delete-button" onClick={() => startDeletion(Merchandise.merchandise_id)}>
                        Delete Merchandise
                    </button>
                </div>
            ))}
        </div>
        )}

        {step === 2 && (
            <div /*center this */>
            {deleteMerch === null ? (
                <>
                <p className="attraction-name">Error Gathering Merchandise Information</p>
                <button className="delete-button" onClick={() => setStep(1)}>Go back</button>
                </>
            ): (
                <>
                <div>
                    <h2>Are you sure you want to DELETE <span /*make this text colored red*/>{deleteMerch.merchandise_name}</span></h2>
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

export default HandleMerchandise;
