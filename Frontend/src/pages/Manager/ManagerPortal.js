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
    first_name: '',
    last_name: '',
    role: '',
    attraction_pos: '',
    email: '',
    phone_number: '',
    password: '',
    supervisor_email: ''
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
        first_name: '',
        last_name: '',
        role: '',
        attraction_pos: '',
        email: '',
        phone_number: '',
        password: '',
        supervisor_email: ''
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

  const handleEdit = (employee) => {
    console.log("Editing employee:", employee); // Debug log
    
    // Convert attraction_pos to the format expected by the backend
    let attractionPos = employee.attraction_pos;
    
    // If what we have is attraction_name but we need attraction_pos
    if (employee.attraction_name === "attration1" && !attractionPos) {
      attractionPos = 1;
    }
    
    // Find supervisor email if supervisor ID exists
    let supervisorEmail = '';
    if (employee.supervisors_id) {
      const supervisor = employees.find(emp => emp.employee_id === employee.supervisors_id);
      if (supervisor) {
        supervisorEmail = supervisor.email;
      }
    }
    
    // Set form data with employee data - focusing on email as identifier
    setFormData({
      first_name: employee.first_name,
      last_name: employee.last_name,
      role: employee.role,
      attraction_pos: attractionPos,
      email: employee.email, // This is now our primary identifier
      phone_number: employee.phone_number,
      supervisor_email: supervisorEmail,
      // We don't need to include supervisor_ID directly anymore
    });
    
    setEditMode(true);
    setActiveTab('edit');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (editMode) {
      // Update existing employee
      try {
        // Create a clean copy of formData for sending
        const updateData = { ...formData };
        
        // Make sure we have email (required by backend)
        if (!updateData.email) {
          alert('Error: Email is missing. Cannot update.');
          return;
        }
        
        // Ensure attraction_pos is in the format expected by backend
        if (updateData.attraction_pos === "attration1") {
          updateData.attraction_pos = 1;
        }
        
        console.log("Sending update data:", updateData); // Debug log
        
        const response = await fetch('http://localhost:4000/updateEmployee', {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateData)
        });
        
        // Log the raw response for debugging
        console.log("Update response status:", response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Update error response:", errorText);
          throw new Error(`Failed to update employee: ${response.status} ${errorText}`);
        }
        
        const data = await response.json();
        console.log("Update response data:", data); // Debug log
        
        if (data.success || data.message === "Success") {
          // Update successful
          setRefreshEmployees(!refreshEmployees); // Trigger refresh
          setActiveTab('view');
        } else {
          alert('Error updating employee: ' + data.message);
        }
      } catch (error) {
        console.error('Error updating employee:', error);
        alert('Error updating employee: ' + error.message);
      }
    } else {
      // Create new employee
      try {
        // Create a clean copy of formData for sending
        const createData = { ...formData };
        
        // Ensure attraction_pos is in the format expected by backend
        if (createData.attraction_pos === "attration1") {
          createData.attraction_pos = 1;
        }
        
        console.log("Sending create data:", createData); // Debug log
        
        const response = await fetch('http://localhost:4000/createEmployee', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(createData)
        });
        
        // Log the raw response for debugging
        console.log("Create response status:", response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Create error response:", errorText);
          throw new Error(`Failed to create employee: ${response.status} ${errorText}`);
        }
        
        const data = await response.json();
        console.log("Create response data:", data); // Debug log
        
        if (data.message === "Success") {
          // Creation successful
          setRefreshEmployees(!refreshEmployees); // Trigger refresh
          setActiveTab('view');
        } else {
          alert('Error creating employee: ' + data.message);
        }
      } catch (error) {
        console.error('Error creating employee:', error);
        alert('Error creating employee: ' + error.message);
      }
    }
  };

  const handleDelete = async (email) => {
    if (window.confirm(`Are you sure you want to delete this employee (${email})?`)) {
      try {
        const response = await fetch('http://localhost:4000/deleteEmployee', {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email }) // Send identifier
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
            employees={employees} // Pass employees for supervisor dropdown
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