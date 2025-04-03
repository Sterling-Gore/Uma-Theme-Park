import React, { useState, useEffect, useRef } from "react";

const Dashboard = ({ setActiveTab }) => {
    const alertShown = useRef(false);
    const [loading, setLoading] = useState(true);
    const [creationError, setCreationError] = useState('');
    const [updateError, setUpdateError] = useState('');
    const [employeeAttraction, setEmployeeAttraction] = useState(null);
    const [step, setStep] = useState(1);
    const [refreshPage, setRefreshPage] = useState(false);
    const [activeMaintenanceLog, setActiveMaintenanceLog] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showActiveLog, setShowActiveLog] = useState(true);

    const[ formData, setFormData] = useState({
      maintenanceLogName : "",
      maintenanceLogDescription: "",
      maintenanceLogEstimatedPrice: "",
      maintenanceLogExpectedCompletionDate : ""
    })

    function isDateValid(date) {
      const today = new Date();
      const minDate = new Date().toISOString().split('T')[0];  // Today's date as the min
      const maxDate = new Date(new Date().setFullYear(today.getFullYear() + 1)).toISOString().split('T')[0]; // 1 year from today
  
      // Check if the date is within the min and max range
      return date >= minDate && date <= maxDate;
    }
  
    function checkCreationError()
    {
        if ( formData.maintenanceLogName === "")
        {
          setCreationError("Give the maintenance log a name");
            return true;
        }
        if ( formData.maintenanceLogDescription === "")
        {
          setCreationError("Give the maintenance log a description");
            return true;
        }
        if ( formData.maintenanceLogEstimatedPrice === "")
        {
          setCreationError("Give the estimated cost for the maintenance log");
            return true;
        }
        if ( formData.maintenanceLogExpectedCompletionDate === "")
        {
          setCreationError("Give the expected maintenance completion date");
            return true;
        }
        if (!isDateValid(formData.maintenanceLogExpectedCompletionDate))
        {
          setCreationError("Give a valid maintenance completion date within this year")
            return true;
        }          
        
        setCreationError("");
        return false;
    }

    useEffect(() => {
      checkCreationError();
    }, [formData])

    function checkUpdateError()
    {
        if ( activeMaintenanceLog === null)
        {
          setUpdateError("No maintenance log active");
            return true;
        }
        if ( activeMaintenanceLog.maintenance_name === "")
        {
          setCreationError("Give the maintenance log a name");
            return true;
        }
        if ( activeMaintenanceLog.maintenance_description === "")
        {
          setUpdateError("Give the maintenance log a description");
            return true;
        }
        if ( activeMaintenanceLog.maintenance_cost === "")
        {
          setUpdateError("Give the estimated cost for the maintenance log");
            return true;
        }
        if ( activeMaintenanceLog.expected_completion_date === "")
        {
          setUpdateError("Give the expected maintenance completion date");
            return true;
        }
        if (!isDateValid(activeMaintenanceLog.expected_completion_date))
        {
          setUpdateError("Give a valid maintenance completion date within this year")
            return true;
        }          
        
        setUpdateError("");
        return false;
    }

    useEffect(() => {
      checkUpdateError();
    }, [activeMaintenanceLog])



    const  submitMaintenanceLog = async () => {
      try {
        const dataToSend = {
          name : formData.maintenanceLogName,
          description : formData.maintenanceLogDescription,
          cost : Number(formData.maintenanceLogEstimatedPrice),
          expectedDate : formData.maintenanceLogExpectedCompletionDate,
          attractionID : employeeAttraction.attraction_id
        }
        console.log(dataToSend);
        const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/createMaintenanceLog`, {
            method: 'POST',
            credentials: 'include',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend),
          });

          if (!response.ok) {
            throw new Error('Failed to create maintenance log');
          }
          const data = await response.json();
          if (data.success) {
              goBack();
          }
      } catch (error) {
        console.log(`Error creating maintenance log: ${error}`)
        console.error('Error creating maintenance log:', error);
        alertShown.current = true;
        alert("Error creating maintenance log ");
    }
    }

    const closeMaintenance = async () => {
      try {
        const dataToSend = {
          log_id : activeMaintenanceLog.log_id
        }
        console.log(dataToSend);
        const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/closeMaintenanceLog`, {
            method: 'POST',
            credentials: 'include',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend),
          });

          if (!response.ok) {
            throw new Error('Failed to close maintenance log');
          }
          const data = await response.json();
          if (data.success) {
            console.log("SUCESSSSSSSS");
              setActiveMaintenanceLog(null);
              //window.location.reload();
          }
      } catch (error) {
        console.log(`Error close maintenance log: ${error}`)
        console.error('Error close maintenance log:', error);
        alertShown.current = true;
        alert("Error close maintenance log ");
      }
    }

    const saveEdit = async () => {
      try {
        const dataToSend = {
          log_id : activeMaintenanceLog.log_id,
          name : activeMaintenanceLog.maintenance_name,
          description : activeMaintenanceLog.maintenance_description,
          cost : activeMaintenanceLog.maintenance_cost,
          expected_completion_date : activeMaintenanceLog.expected_completion_date
        }
        console.log(dataToSend);
        const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/editMaintenanceLog`, {
            method: 'POST',
            credentials: 'include',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend),
          });

          if (!response.ok) {
            throw new Error('Failed to edit maintenance log');
          }
          const data = await response.json();
          if (data.success) {
            console.log("SUCESSSSSSSS");
              setIsEditing(false);
              //window.location.reload();
          }
      } catch (error) {
        console.log(`Error edit maintenance log: ${error}`)
        console.error('Error edit maintenance log:', error);
        alertShown.current = true;
        alert("Error edit maintenance log ");
      }
    }
    
    useEffect(() => {
        const fetchAttraction = async () => {
            try {
              const userID = localStorage.getItem('userID');
                const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/getEmployeeAssignedAttraction`, {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userID: userID })
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch attractions');
                }
                const result = await response.json();

                if (result.success) {
                  setEmployeeAttraction(result.data);
                } else {
                    throw new Error(result.message || 'Failed to fetch attractions');
                }
            } catch (error) {
                console.error('Error fetching attractions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAttraction();
    }, [refreshPage]);

      
    useEffect(() => {
      const fetchActiveMaintenanceLog = async () => {
          try {
            const userID = localStorage.getItem('userID');
              const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/getActiveMaintenanceLog`, {
                  method: 'POST',
                  mode: 'cors',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ userID: userID })
              });
              
              if (!response.ok) {
                  throw new Error('Failed to fetch active maintenance log');
              }
              const result = await response.json();

              if (result.success) {
                setActiveMaintenanceLog(result.data);
              } else {
                  throw new Error(result.message || 'Failed to fetch active maintenance log');
              }
          } catch (error) {
              console.error('Error fetching active maintenance log:', error);
          } finally {
              setLoading(false);
          }
      };

      fetchActiveMaintenanceLog();
  }, [refreshPage]); 

    function cancelEdit()
    {
      setRefreshPage(!refreshPage);
      setIsEditing(false);
    }


    function goBack()
    {
      setRefreshPage(!refreshPage);
      setStep(1);
      setIsEditing(false);
      setFormData({
        maintenanceLogName : "",
        maintenanceLogDescription : "",
        maintenanceLogEstimatedPrice : "",
        maintenanceLogExpectedCompletionDate : ""
      });
    }
    


    function swapTabs(isActiveLog)
    {
      if(isActiveLog !== showActiveLog)
      {
        goBack();
        setShowActiveLog(isActiveLog);
      }
    }



    console.log(activeMaintenanceLog);

    
    return (
      <div className="dashboard-container">
        <div className="content-header">
            <h2>Your Dashboard</h2>
            <div className="filter-buttons">
              <button
                className={showActiveLog ? "active-filter" : ""}
                onClick={() => swapTabs(true)}
              >
                Active Log
              </button>
              <button
                className={!showActiveLog ? "active-filter" : ""}
                onClick={() => swapTabs(false)}
              >
                Previous Logs
              </button>
            </div>
        </div>
        {loading ? (
          <p className="activities-intro">Loading your page...</p>
        ): (
          
          <>
          {showActiveLog ? (<>

          {employeeAttraction === null ? (
            <p className="activities-intro">You have not been assigned an attraction, notify your manager.</p>
          ) : (
            <>
            {activeMaintenanceLog !== null ? (
              <>
                <h2 className="attraction-name">Assigned Attraction: {employeeAttraction.attraction_name}</h2> 
                {employeeAttraction.viewing_image && employeeAttraction.mimeType ? (
                    <div className="center-image">
                  <img 
                      src={`data:${employeeAttraction.mimeType};base64,${employeeAttraction.viewing_image}`}
                      alt="Attraction Image"
                      style={{ width: '300px', height: '300px', objectFit: 'contain' }} 
                  />
                  </div>
                  ) : (
                      <p>Loading Image ... </p>
                  )}
                  <h2 className="attraction-name">Under Maintenance</h2> 

                  <div className="form-group">
                  <label >Maintenance Log Name</label>
                  <input
                      type="text"
                      value={activeMaintenanceLog.maintenance_name || ''}
                      onChange={(e) => {
                          //const onlyLettersAndSpaces = e.target.value.replace(/[^a-zA-Z\s]/g, ""); // Allow letters and spaces
                          setActiveMaintenanceLog({ ...activeMaintenanceLog, maintenance_name: e.target.value });
                      }} 
                      disabled = {true}
                      placeholder="Name for Maintenance Log"
                      maxLength="200"
                      minLength="1"
                      required
                  />
                  </div>

                  <div className="form-group">
                  <label >Maintenance Log Description</label>
                  <textarea
                      className="description-box"
                      value={activeMaintenanceLog.maintenance_description || ''}
                      onChange={(e) => {
                        setActiveMaintenanceLog({ ...activeMaintenanceLog, maintenance_description: e.target.value });
                      }}   
                      disabled = {!isEditing}
                      placeholder="Description for Maintenance Log"
                      maxLength="400"
                      minLength="1"
                      required
                  />
                  </div>

                  <div className="form-group">
                  <label >Estimated Maintenance Cost</label>
                  <input
                      type="text"
                      value={`$${activeMaintenanceLog.maintenance_cost}` || ''}
                      onChange={(e) => {
                          let digitsOnly = e.target.value.replace(/\D/g, ""); 
                          setActiveMaintenanceLog({ ...activeMaintenanceLog, maintenance_cost: digitsOnly });
                      }} 
                      disabled = {!isEditing}
                      placeholder="Cost of Maintenance Log"
                      maxLength="9"
                      minLength="1"
                      required
                  />
                  </div>

                  <div className="form-row">
                  <div className="form-group">
                    <label >Original maintenance date</label>
                    <input 
                        type="date"
                        //className="form-input"
                        placeholder="Original Maintenance Date"
                        value={activeMaintenanceLog.maintenance_date}
                        onChange={(e) => {}}
                        disabled = {true}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        max={new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="form-group">
                    <label >Expected Maintenance Completion Date</label>
                    <input 
                        type="date"
                        //className="form-input"
                        placeholder="Completion Date"
                        value={activeMaintenanceLog.expected_completion_date}
                        onChange={(e) => {
                          setActiveMaintenanceLog({ ...activeMaintenanceLog, expected_completion_date: e.target.value});
                            //checkError();
                        }}
                        disabled = {!isEditing}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        max={new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]}
                    />
                  </div>
                  </div>

                  {!isEditing ? (
                  <div className="attraction-footer">
                      <button className="attraction-button" onClick={() => setIsEditing(true)}>
                          Edit Maintenance
                      </button>
                      <button className="attraction-button" onClick={() => closeMaintenance()}>
                          Close Maintenance on Attraction
                      </button>   
                  </div>
                  ) : (
                    <>
                    {updateError !== "" && (<p className="error-message">{updateError}</p>)}
                    <div className="attraction-footer">
                      <button className="attraction-button" onClick={() => cancelEdit()}>
                          Cancel Edit
                      </button>
                      { updateError === "" && (
                      <button className="attraction-button" onClick={() => saveEdit()}>
                          Save Edit
                      </button>  
                      )} 
                    </div>
                    </>
                  )}
              </>
            ) : 
            (<>
            { step === 1 && (
              <div className="attraction-content">
                  <h2 className="attraction-name">Assigned Attraction: {employeeAttraction.attraction_name}</h2>
                  {employeeAttraction.viewing_image && employeeAttraction.mimeType ? (
                    <div className="center-image">
                  <img 
                      src={`data:${employeeAttraction.mimeType};base64,${employeeAttraction.viewing_image}`}
                      alt="Attraction Image"
                      style={{ width: '300px', height: '300px', objectFit: 'contain' }} 
                  />
                  </div>
                  ) : (
                      <p>Loading Image ... </p>
                  )}
                  <div className="attraction-details">
                    
                  </div>
                  <div className="attraction-footer">
                      <button className="attraction-button" onClick={() => setStep(2)}>
                          Start Maintenance
                      </button>
                      
                  </div>
              </div> )}
            {step === 2 && (
              <div className="attraction-content">
                  <h2 className="attraction-name">Maintenance for {employeeAttraction.attraction_name}</h2>

                  <div className="form-group">
                  <label >Maintenance Log Name</label>
                  <input
                      type="text"
                      value={formData.maintenanceLogName || ''}
                      onChange={(e) => {
                          //const onlyLettersAndSpaces = e.target.value.replace(/[^a-zA-Z\s]/g, ""); // Allow letters and spaces
                          setFormData({ ...formData, maintenanceLogName: e.target.value });
                      }} 
                      placeholder="Name for Maintenance Log"
                      maxLength="200"
                      minLength="1"
                      required
                  />
                  </div>

                  <div className="form-group">
                  <label >Maintenance Log Description</label>
                  <textarea
                      className="description-box"
                      value={formData.maintenanceLogDescription || ''}
                      onChange={(e) => {
                          setFormData({ ...formData, maintenanceLogDescription: e.target.value });
                      }}   
                      placeholder="Description for Maintenance Log"
                      maxLength="400"
                      minLength="1"
                      required
                  />
                  </div>

                  <div className="form-group">
                  <label >Estimated Maintenance Cost</label>
                  <input
                      type="text"
                      value={`$${formData.maintenanceLogEstimatedPrice}` || ''}
                      onChange={(e) => {
                          let digitsOnly = e.target.value.replace(/\D/g, ""); 
                          setFormData({ ...formData, maintenanceLogEstimatedPrice: digitsOnly });
                      }} 
                      placeholder="Cost of Maintenance Log"
                      maxLength="9"
                      minLength="1"
                      required
                  />
                  </div>

                  <div className="form-group">
                  <label >Expected Maintenance Completion Date</label>
                  <input 
                      type="date"
                      //className="form-input"
                      placeholder="Completion Date"
                      value={formData.maintenanceLogExpectedCompletionDate}
                      onChange={(e) => {
                          setFormData({ ...formData, maintenanceLogExpectedCompletionDate: e.target.value});
                          //checkError();
                      }}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      max={new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]}
                  />
                  </div>

                  {creationError !== "" && (<p className="error-message">{creationError}</p>)}
                  <div className="attraction-footer">
                      <button className="attraction-button" onClick={() => goBack()}>
                          Cancel Maintenance
                      </button>
                      {creationError === "" && (
                      <button className="attraction-button" onClick={() => submitMaintenanceLog()}>
                          Submit Maintenance
                      </button>
                      )}
                      
                  </div>
              </div>
              
            )}
            </>)}
            </>
          
          )}
        </>) : (
          <>



          </>)}
          </>
        )}

      </div>
    );
  };
  export default Dashboard;