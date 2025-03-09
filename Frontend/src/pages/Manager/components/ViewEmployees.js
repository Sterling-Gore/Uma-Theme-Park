import React from 'react';

const ViewEmployees = ({ employees, handleEdit, handleDelete, searchTerm, setSearchTerm }) => {
  const filteredEmployees = employees.filter(employee => 
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <th>Department</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Start Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map(employee => (
              <tr key={employee.email}>
                <td>{employee.name}</td>
                <td>{employee.position}</td>
                <td>{employee.department}</td>
                <td>{employee.email}</td>
                <td>{employee.phone}</td>
                <td>{employee.startDate}</td>
                <td className="action-buttons">
                  <button className="edit-btn" onClick={() => handleEdit(employee)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(employee.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="no-results">No employees found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ViewEmployees;