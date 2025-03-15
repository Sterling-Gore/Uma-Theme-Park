import React from 'react';
const Tasks = ({ setActiveTab }) => {
    return (
      <div className="tasks-container">
        <h2>My Tasks</h2>
        <p>View your assigned tasks and their statuses.</p>
        <button onClick={() => setActiveTab('dashboard')}>Back to Dashboard</button>
      </div>
    );
  };
  export default Tasks;