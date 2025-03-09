import React, { useState, useEffect } from 'react';

const ViewEmployees = ({ handleEdit, handleDelete }) => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        const response =await fetch('http://localhost:4000/viewEmployees', {
          method: 'GET',
          mode: 'cors',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          setEmployees(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch employees');
        }
      } catch (err) {
        console.error('Error fetching employees:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter(employee => 
    `${employee.first_name} ${employee.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.attraction_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div className="loading">Loading employees...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="view-employees">
      <div className="content-header">
        <h2>Employee Management</h2>
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search employees..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <table className="employee-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((employee, index) => (
              <tr key={index}>
                <td>{`${employee.first_name} ${employee.last_name}`}</td>
                <td>{employee.attraction_name}</td>
                <td>{employee.email}</td>
                <td>{employee.phone_number}</td>
                <td className="action-buttons">
                  <button className="edit-btn" onClick={() => handleEdit(employee)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(employee.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="no-results">No employees found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ViewEmployees;