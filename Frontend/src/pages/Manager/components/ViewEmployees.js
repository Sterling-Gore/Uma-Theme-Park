import React, { useState, useEffect } from 'react';

const ViewEmployees = ({ setActiveTab }) => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshEmployees, setRefreshEmployees] = useState(false);

  // Fetch employees from backend
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/viewEmployees`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch employees');
        }

        const data = await response.json();
        if (data.success) {
          setEmployees(data.data);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, [refreshEmployees]);

  const handleAssignAttraction = (employee) => {
    // Store the employee data in localStorage for the attraction assignment component to access
    localStorage.setItem('editEmployee', JSON.stringify(employee));
    setActiveTab('assign');
  };

  const handleDelete = async (email) => {
    if (window.confirm(`Are you sure you want to delete this employee (${email})?`)) {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/deleteEmployee`, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email })
        });

        if (!response.ok) {
          throw new Error('Failed to delete employee');
        }

        const data = await response.json();
        if (data.success || data.message === "Success") {
          // Deletion successful
          setRefreshEmployees(!refreshEmployees); // Trigger refresh
        } else {
          alert('Error deleting employee: ' + data.message);
        }
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Error deleting employee. Please try again.');
      }
    }
  };

  const filteredEmployees = employees.filter(employee => {
    const fullName = `${employee.first_name || ''} ${employee.last_name || ''}`.toLowerCase();
    const searchLower = (searchTerm || '').toLowerCase();

    return fullName.includes(searchLower) ||
      (employee.attraction_name?.toLowerCase() || '').includes(searchLower) ||
      (employee.email?.toLowerCase() || '').includes(searchLower);
  });

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
            <th>Current Attraction</th>
            <th>Role</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((employee) => (
              <tr key={employee.employee_id || employee.email}>
                <td>{`${employee.first_name} ${employee.last_name}`}</td>
                <td>{employee.attraction_name || 'Not Assigned'}</td>
                <td>{employee.role}</td>
                <td>{employee.email}</td>
                <td>{employee.phone_number}</td>
                <td className="action-buttons">
                  <button className="edit-btn" onClick={() => handleAssignAttraction(employee)}>
                    Assign Attraction
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(employee.email)}>
                    Delete
                  </button>
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