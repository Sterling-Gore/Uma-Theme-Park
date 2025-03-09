import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ViewEmployees from './components/ViewEmployees';
import EmployeeForm from './components/EmployeeForm';
import Reports from './components/Reports';
import './ManagerPortal.css';

function ManagerPortal() {
  const [activeTab, setActiveTab] = useState('view');
  const [employees, setEmployees] = useState([
    { id: 1, name: 'John Doe', position: 'Ride Operator', department: 'Attractions', email: 'john.doe@parkname.com', phone: '555-123-4567', startDate: '2023-05-15' },
    { id: 2, name: 'Jane Smith', position: 'Food Service', department: 'Dining', email: 'jane.smith@parkname.com', phone: '555-987-6543', startDate: '2022-03-10' },
    { id: 3, name: 'Mike Johnson', position: 'Gift Shop Attendant', department: 'Retail', email: 'mike.johnson@parkname.com', phone: '555-456-7890', startDate: '2023-09-22' },
  ]);
  
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    position: '',
    department: '',
    email: '',
    phone: '',
    startDate: ''
  });

  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'create') {
      setFormData({
        id: employees.length > 0 ? Math.max(...employees.map(emp => emp.id)) + 1 : 1,
        name: '',
        position: '',
        department: '',
        email: '',
        phone: '',
        startDate: ''
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      // Update existing employee
      setEmployees(employees.map(emp => 
        emp.id === formData.id ? formData : emp
      ));
      setEditMode(false);
    } else {
      // Add new employee
      setEmployees([...employees, formData]);
    }
    
    // Clear form
    setFormData({
      id: employees.length > 0 ? Math.max(...employees.map(emp => emp.id)) + 1 : 1,
      name: '',
      position: '',
      department: '',
      email: '',
      phone: '',
      startDate: ''
    });
    
    // Switch to view tab
    setActiveTab('view');
  };

  const handleEdit = (employee) => {
    setFormData(employee);
    setEditMode(true);
    setActiveTab('edit');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      setEmployees(employees.filter(emp => emp.id !== id));
    }
  };
  
  const handleLogout = () => {
    // Clear localStorage first
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userType");
    
    // Call API directly
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