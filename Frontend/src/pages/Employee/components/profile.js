import { useState, useEffect } from "react";
import "./profile.css";

export default function UpdateEmployeeForm() {
    const [employeeData, setEmployeeData] = useState({
        employee_id: localStorage.getItem("userID"),
        first_name: "",
        last_name: "",
        email: ""
    });

    const [passwordData, setPasswordData] = useState({
        password: "",
        confirm_password: "",
        employee_id: localStorage.getItem("userID")
    });

    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [loading, setLoading] = useState(true);

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
                    setEmployeeData((prevData) => ({
                        ...prevData,
                        first_name: result.data.first_name || "",
                        last_name: result.data.last_name || "",
                        email: result.data.email || ""
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
    }, []);

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
            alert(result.message);
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
                        <input type="text" name="first_name" value={employeeData.first_name} onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                        <label>Last Name</label>
                        <input type="text" name="last_name" value={employeeData.last_name} onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                        <label>Email</label>
                        <input type="email" name="email" value={employeeData.email} onChange={handleChange} required />
                    </div>

                    <button type="submit">Update Profile</button>
                </form>
            )}

            {/* Password update section */}
            <button className="edit-password-btn" onClick={() => setShowPasswordForm(!showPasswordForm)}>
                {showPasswordForm ? "Cancel" : "Edit Password"}
            </button>

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
