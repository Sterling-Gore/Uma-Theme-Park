import React, { useState } from 'react';

const ViewEmployees = ({ employees, handleEdit, handleDelete, searchTerm, setSearchTerm }) => {
  const filteredEmployees = employees.filter(employee => 
    `${employee.first_name} ${employee.last_name}`.toLowerCase().includes(searchTerm?.toLowerCase() || '') ||
    employee.attraction_name?.toLowerCase().includes(searchTerm?.toLowerCase() || '') ||
    employee.email?.toLowerCase().includes(searchTerm?.toLowerCase() || '') || 
    employee.supervisor_name?.toLowerCase.includes(searchTerm?.toLowerCase() || '')
  );

  return (
    <div className="view-employees">
      <div className="content-header">
        <h2>Employee Management</h2>
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search employees..." 
            value={searchTerm || ''}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <table className="employee-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Role</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Supervisor Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((employee) => (
              <tr key={employee.employee_id}>
                <td>{`${employee.first_name} ${employee.last_name}`}</td>
                <td>{employee.attraction_name}</td>
                <td>{employee.role}</td>
                <td>{employee.email}</td>
                <td>{employee.phone_number}</td>
                <td>{employee.supervisor_name}</td>
                <td className="action-buttons">
                  <button className="edit-btn" onClick={() => handleEdit(employee)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(employee.employee_id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="no-results">No employees found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ViewEmployees;