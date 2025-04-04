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
