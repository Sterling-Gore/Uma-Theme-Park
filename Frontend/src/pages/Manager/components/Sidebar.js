import React from 'react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Manager Portal</h2>
      </div>
      <nav className="sidebar-nav">
        <button 
          className={activeTab === 'view' ? 'active' : ''} 
          onClick={() => setActiveTab('view')}
        >
          View Employees
        </button>
        <button 
          className={activeTab === 'create' ? 'active' : ''} 
          onClick={() => setActiveTab('create')}
        >
          Create Employee
        </button>
        <button 
          className={activeTab === 'financeReport' ? 'active' : ''} 
          onClick={() => setActiveTab('financeReport')}
        >
          Finance Report
        </button>
        <button 
          className={activeTab === 'AttractReport' ? 'active' : ''} 
          onClick={() => setActiveTab('AttractReport')}
        >
          Attract Report
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;