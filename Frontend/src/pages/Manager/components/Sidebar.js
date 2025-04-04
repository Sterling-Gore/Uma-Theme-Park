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
          Attraction Report
        </button>
        <button 
          className={activeTab === 'handleMerchandise' ? 'active' : ''} 
          onClick={() => setActiveTab('handleMerchandise')}
        >
          Edit Merchandise
        </button>
        <button 
          className={activeTab === 'createMerchandise' ? 'active' : ''} 
          onClick={() => setActiveTab('createMerchandise')}
        >
          Create Merchandise
        </button>
        <button 
          className={activeTab === 'handleAttractions' ? 'active' : ''} 
          onClick={() => setActiveTab('handleAttractions')}
        >
          Edit Attractions
        </button>
        <button 
          className={activeTab === 'createAttraction' ? 'active' : ''} 
          onClick={() => setActiveTab('createAttraction')}
        >
          Create Attraction
        </button>

        <button 
          className={activeTab === 'handleDining' ? 'active' : ''} 
          onClick={() => setActiveTab('handleDining')}
        >
          Edit Dining
        </button>
        <button 
          className={activeTab === 'createDining' ? 'active' : ''} 
          onClick={() => setActiveTab('createDining')}
        >
          Create Dining
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;