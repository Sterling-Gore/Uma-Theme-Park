import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ViewEmployees from './components/ViewEmployees';
import EmployeeForm from './components/EmployeeForm';
import Reports from './components/Reports';
import './ManagerPortal.css';
import AuthContext from '../../context/AuthContext';

function ManagerPortal() {
  const [activeTab, setActiveTab] = useState('view');
  const [employees, setEmployees] = useState([]);
  const { logout } = useContext(AuthContext)
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    role: '',
    attraction: '',
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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'create') {
      setFormData({
        first_name: '',
        last_name: '',
        role: '',
        attraction: '',
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
    console.log("Editing employee:", employee);


    setFormData({
      first_name: employee.first_name,
      last_name: employee.last_name,
      role: employee.role,
      attraction: employee.attraction,
      email: employee.email,
      phone_number: employee.phone_number,
      supervisor_email: employee.supervisor_email,
    });

    setEditMode(true);
    setActiveTab('edit');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editMode) {

      try {

        const updateData = { ...formData };


        if (!updateData.email) {
          alert('Error: Email is missing. Cannot update.');
          return;
        }

        console.log("Sending update data:", updateData); // Debug log

        const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/updateEmployee`, {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateData)
        });


        console.log("Update response status:", response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Update error response:", errorText);
          throw new Error(`Failed to update employee: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        console.log("Update response data:", data);

        if (data.success || data.message === "Success") {

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

        const createData = { ...formData };

        console.log("Sending create data:", createData); // Debug log

        const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/createEmployee`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(createData)
        });


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

  const handleLogout = () => {
    // Clear localStorage first
    logout();
    // Call API
    fetch(`${process.env.REACT_APP_BACKEND_API}/logout`, {
      method: 'GET',
      credentials: 'include'
    }).finally(() => {
      navigate('/')
    });
  };

  // Determine which component to render based on activeTab
  const renderContent = () => {
    switch (activeTab) {
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
            <span>Logged in as: {localStorage.getItem('fullName')}</span>
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