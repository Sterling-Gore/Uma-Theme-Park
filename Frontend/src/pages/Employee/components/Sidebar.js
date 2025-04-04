import React from 'react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Employee Portal</h2>
      </div>
      <nav className="sidebar-nav">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''} 
          onClick={() => setActiveTab('dashboard')}
        >
          <span className="icon"></span>
          Dashboard
        </button>
        <button 
          className={activeTab === 'profile' ? 'active' : ''} 
          onClick={() => setActiveTab('profile')}
        >
          <span className="icon"></span>
          My Profile
        </button>
        <button 
          className={activeTab === 'tasks' ? 'active' : ''} 
          onClick={() => setActiveTab('tasks')}
        >
          <span className="icon"></span>
          My Tasks
        </button>
        <button 
          className={activeTab === 'handleMerchandise' ? 'active' : ''} 
          onClick={() => setActiveTab('handleMerchandise')}
        >
          <span className="icon"></span>
          Edit Merchandise
        </button>
        <button 
          className={activeTab === 'createMerchandise' ? 'active' : ''} 
          onClick={() => setActiveTab('createMerchandise')}
        >
          <span className="icon"></span>
          Create Merchandise
        </button>
        <button 
          className={activeTab === 'handleAttractions' ? 'active' : ''} 
          onClick={() => setActiveTab('handleAttractions')}
        >
          <span className="icon"></span>
          Edit Attractions
        </button>
        <button 
          className={activeTab === 'createAttraction' ? 'active' : ''} 
          onClick={() => setActiveTab('createAttraction')}
        >
          <span className="icon"></span>
          Create Attraction
        </button>

        <button 
          className={activeTab === 'handleDining' ? 'active' : ''} 
          onClick={() => setActiveTab('handleDining')}
        >
          <span className="icon"></span>
          Edit Dining
        </button>
        <button 
          className={activeTab === 'createDining' ? 'active' : ''} 
          onClick={() => setActiveTab('createDining')}
        >
          <span className="icon"></span>
          Create Dining
        </button>
        <button 
          className={activeTab === 'reports' ? 'active' : ''} 
          onClick={() => setActiveTab('reports')}
        >
          <span className="icon"></span>
          Reports
        </button>

        <button 
          className={activeTab === 'AttractReport' ? 'active' : ''} 
          onClick={() => setActiveTab('AttractReport')}
        >
          <span className="icon"></span>
          Attraction Reports
        </button>
        <button 
          className={activeTab === 'showFeedback' ? 'active' : ''} 
          onClick={() => setActiveTab('showFeedback')}
        >
          <span className="icon"></span>
          Feedback
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
