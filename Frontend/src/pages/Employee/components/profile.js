import { useState, useEffect } from "react";
import "./profile.css";

export default function UpdateEmployeeForm() {
    const [employeeData, setEmployeeData] = useState({
        employee_id: localStorage.getItem("userID"),
        first_name: "",
        last_name: "",
        email: "",
        phone_number:  ""
    });
    const [isEditing, setIsEditing] = useState(false);

    const [passwordData, setPasswordData] = useState({
        password: "",
        confirm_password: "",
        employee_id: localStorage.getItem("userID")
    });

    const [employeeDataError, setEmployeeDataError] = useState('');

    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [refreshEmployeeDate, SetRefreshEmployeeData] = useState(true);

    useEffect(() => {
        const fetchEmployeeData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/getEmployeeInfo`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({"employee_id": localStorage.getItem("userID")})
                });

                const result = await response.json();
                if (result.message === "Success" && result.data) {
                    console.log(result.data);
                    setEmployeeData((prevData) => ({
                        ...prevData,
                        first_name: result.data.first_name || "",
                        last_name: result.data.last_name || "",
                        email: result.data.email || "",
                        phone_number : result.data.phone_number || ""
                    }));
                }
            } catch (error) {
                console.error("Error fetching employee data:", error);
                alert("Failed to fetch employee data");
            } finally {
                setLoading(false);
            }
        };

        fetchEmployeeData();
    }, [refreshEmployeeDate]);

    useEffect( () => {
        checkEmployeeDataError();
    }, [employeeData])

    const validateEmail = (email) => {
        return email.match(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
        
      };
      
    function checkEmployeeDataError(){
        if(employeeData.first_name === "")
        {
            setEmployeeDataError("Fill in your first name");
            return false;
        }
        if(employeeData.last_name === "")
        {
            setEmployeeDataError("Fill in your last name");
            return false;
        }
        if(employeeData.email === "")
        {
            setEmployeeDataError("Fill in your email");
            return false;
        }
        if(!validateEmail(employeeData.email))
        {
            setEmployeeDataError("Enter a valid email");
            return false;
        }
        if(employeeData.phone_number === "")
        {
            setEmployeeDataError("Fill in your phone number");
            return false;
        }
        if(employeeData.phone_number.length < 10)
        {
            setEmployeeDataError("Enter a valid phone number");
            return false;
        }
        setEmployeeDataError("");
        return true;
    }

    const handleChange = (e) => {
        setEmployeeData({
            ...employeeData,
            [e.target.name]: e.target.value
        });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(employeeData);
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/updateEmployeeProfile`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(employeeData)
            });

            const result = await response.json();
            if(result.success)
            {
                setIsEditing(false);
            }
            else
            {
                alert(result.message);
            }
        } catch (error) {
            console.error("Error updating employee profile:", error);
            alert("Failed to update employee profile");
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (passwordData.password !== passwordData.confirm_password) {
            alert("Passwords do not match!");
            return;
        }
        if(passwordData.password.length < 8)
        {
          alert("Password must be more than 8 characters.");
          return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/updateEmployeePassword`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(passwordData)
            });

            const result = await response.json();
            alert(result.message);
            setShowPasswordForm(false); // Hide password form after successful update
            setPasswordData({ password: "", confirm_password: "" }); // Clear password fields
        } catch (error) {
            console.error("Error updating password:", error);
            alert("Failed to update password");
        }
    };

    return (
        <div className="form-container">
            <h2>Personal Information</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <form onSubmit={handleSubmit}>

                    <div className="input-group">
                        <label>First Name</label>
                        <input type="text" name="first_name" value={employeeData.first_name} onChange={handleChange} maxLength={50} disabled={!isEditing} required />
                    </div>

                    <div className="input-group">
                        <label>Last Name</label>
                        <input type="text" name="last_name" value={employeeData.last_name} onChange={handleChange} maxLength={50} disabled={!isEditing} required />
                    </div>

                    <div className="input-group">
                        <label>Email</label>
                        <input type="email" name="email" value={employeeData.email} onChange={handleChange} maxLength={100} disabled={!isEditing} required />
                    </div>
                    <div className="input-group">
                        <label>Phone Number</label>
                        <input 
                            type="text" name="phone_number" 
                            value={employeeData.phone_number} 
                            onChange={(e) => {
                                const onlyDigits = e.target.value.replace(/\D/g, ""); // Remove non-digits
                                setEmployeeData({ ...employeeData, phone_number: onlyDigits});
                                //checkError();
                            }} 
                            maxLength={10} 
                            minLength={10}
                            disabled={!isEditing}  
                            required />
                    </div>

                        
                    {!isEditing && !showPasswordForm && <button className="edit-profile-btn" onClick={() => (setIsEditing(true))}>Update Profile</button>}
                    {isEditing && employeeDataError !== "" && (<p className="error-message">{employeeDataError}</p>)}
                    <div className="div-row">
                        {isEditing && <button onClick={() => (setIsEditing(false), SetRefreshEmployeeData(!refreshEmployeeDate))} className="edit-password-btn">Cancel</button>}
                        {isEditing && employeeDataError === "" && <button type="submit" className="edit-profile-btn">Save Changes</button>}
                    </div>
                </form>
            )}

            {/* Password update section */}
            {!isEditing && <button className="edit-password-btn" onClick={() => setShowPasswordForm(!showPasswordForm)}>
                {showPasswordForm ? "Cancel" : "Edit Password"}
            </button>}

            {showPasswordForm && (
                <form onSubmit={handlePasswordSubmit} className="password-form">
                    <h3>Update Password</h3>
                    <div className="input-group">
                        <label>New Password</label>
                        <input type="password" name="password" value={passwordData.password} onChange={handlePasswordChange} required />
                    </div>

                    <div className="input-group">
                        <label>Confirm New Password</label>
                        <input type="password" name="confirm_password" value={passwordData.confirm_password} onChange={handlePasswordChange} required />
                    </div>

                    <button type="submit">Update Password</button>
                </form>
            )}
        </div>
    );
}
