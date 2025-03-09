import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ViewEmployees from './components/ViewEmployees';
import EmployeeForm from './components/EmployeeForm';
import Reports from './components/Reports';
import './ManagerPortal.css';

function ManagerPortal() {
  const [activeTab, setActiveTab] = useState('view');
  const [employees, setEmployees] = useState([]);
  
  const [formData, setFormData] = useState({
    employee_id: '',
    first_name: '',
    last_name: '',
    role: '',
    attraction_pos: '',
    email: '',
    phone_number: '',
    password: '',
    supervisor_name: ''
  });

  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshEmployees, setRefreshEmployees] = useState(false);

  // Fetch employees from backend
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://localhost:4000/viewEmployees', {
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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'create') {
      setFormData({
        employee_id: '',
        first_name: '',
        last_name: '',
        role: '',
        attraction_name: '',
        email: '',
        phone_number: '',
        password: '',
        supervisor_name: ''
      });
      setEditMode(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (editMode) {
      // Update existing employee
      try {
        const response = await fetch('http://localhost:4000/updateEmployee', {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
          throw new Error('Failed to update employee');
        }
        
        const data = await response.json();
        if (data.success || data.message === "Success") {
          // Update successful
          setRefreshEmployees(!refreshEmployees); // Trigger refresh
          setActiveTab('view');
        } else {
          alert('Error updating employee: ' + data.message);
        }
      } catch (error) {
        console.error('Error updating employee:', error);
        alert('Error updating employee. Please try again.');
      }
    } else {
      // Create new employee
      try {
        const response = await fetch('http://localhost:4000/registerEmployee', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
          throw new Error('Failed to create employee');
        }
        
        const data = await response.json();
        if (data.message === "Success") {
          // Creation successful
          setRefreshEmployees(!refreshEmployees); // Trigger refresh
          setActiveTab('view');
        } else {
          alert('Error creating employee: ' + data.message);
        }
      } catch (error) {
        console.error('Error creating employee:', error);
        alert('Error creating employee. Please try again.');
      }
    }
  };

  const handleEdit = (employee) => {
    // Set form data with employee data
    setFormData({
      employee_id: employee.employee_id,
      first_name: employee.first_name,
      last_name: employee.last_name,
      role: employee.role,
      attraction_pos: employee.attraction_name,
      email: employee.email,
      phone_number: employee.phone_number,
      supervisor_name: employee.supervisor_name || ''
    });
    setEditMode(true);
    setActiveTab('edit');
  };

  const handleDelete = async (employee_id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const response = await fetch('http://localhost:4000/deleteEmployee', {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ employee_id })
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
  
  const handleLogout = () => {
    // Clear localStorage first
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userType");
    
    // Call API
    fetch('http://localhost:4000/logout', {
      method: 'GET',
      credentials: 'include'
    }).finally(() => {
      window.location.href = '/';
    });
  };

  // Determine which component to render based on activeTab
  const renderContent = () => {
    switch(activeTab) {
      case 'view':
        return (
          <ViewEmployees 
            employees={employees} 
            handleEdit={handleEdit} 
            handleDelete={handleDelete} 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
          />
        );
      case 'create':
      case 'edit':
        return (
          <EmployeeForm 
            formData={formData} 
            handleInputChange={handleInputChange} 
            handleSubmit={handleSubmit} 
            editMode={editMode} 
            setActiveTab={setActiveTab} 
          />
        );
      case 'reports':
        return <Reports />;
      default:
        return <ViewEmployees employees={employees} handleEdit={handleEdit} handleDelete={handleDelete} />;
    }
  };

  return (
    <div className="manager-portal">
      <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />
      <div className="content-area">
        <div className="top-bar">
          <div className="user-info">
            <span>Logged in as: Manager</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <span className="logout-icon">🚪</span> Logout
          </button>
        </div>
        <div className="main-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default ManagerPortal;