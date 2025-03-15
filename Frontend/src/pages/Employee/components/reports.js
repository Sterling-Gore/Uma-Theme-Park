import React from "react";
const Reports = ({ setActiveTab }) => {
    return (
      <div className="reports-container">
        <h2>Reports</h2>
        <p>Access and generate reports.</p>
        <button onClick={() => setActiveTab('dashboard')}>Back to Dashboard</button>
      </div>
    );
  };
  export default Reports;