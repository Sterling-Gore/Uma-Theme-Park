import { useState, useEffect } from "react";

export default function UpdateEmployeeForm() {
    const [employeeData, setEmployeeData] = useState({
        employee_id: "",
        first_name: "",
        last_name: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setEmployeeData({
            ...employeeData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/updateEmployeeProfile`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
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

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="employee_id" placeholder="Employee ID" value={employeeData.employee_id} onChange={handleChange} required />
            <input type="text" name="first_name" placeholder="First Name" value={employeeData.first_name} onChange={handleChange} required />
            <input type="text" name="last_name" placeholder="Last Name" value={employeeData.last_name} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" value={employeeData.email} onChange={handleChange} required />
            <input type="password" name="password" placeholder="New Password" value={employeeData.password} onChange={handleChange} required />
            <button type="submit">Update Profile</button>
        </form>
    );
}
