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
          <span className="icon">👥</span>
          View Employees
        </button>
        <button 
          className={activeTab === 'create' ? 'active' : ''} 
          onClick={() => setActiveTab('create')}
        >
          <span className="icon">➕</span>
          Create Employee
        </button>
        <button 
          className={activeTab === 'reports' ? 'active' : ''} 
          onClick={() => setActiveTab('reports')}
        >
          <span className="icon">📊</span>
          Reports
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;