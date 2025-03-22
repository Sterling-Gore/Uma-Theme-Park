import React, { useState, useEffect } from 'react';

const Reports = ({ setActiveTab }) => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const fetchReportData = async (reportType) => {
    setLoading(true);
    setError(null);

    try {

      console.log(`Fetching ${reportType} report...`);


      await new Promise(resolve => setTimeout(resolve, 1000));


      const mockData = {
        reportType,
        date: new Date().toLocaleDateString(),
        data: [
          { category: 'Category A', value: Math.floor(Math.random() * 100) },
          { category: 'Category B', value: Math.floor(Math.random() * 100) },
          { category: 'Category C', value: Math.floor(Math.random() * 100) },
        ]
      };

      setReportData(mockData);
    } catch (err) {
      console.error('Error fetching report data:', err);
      setError('Failed to load report data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reports">
      <div className="content-header">
        <h2>Reports</h2>
      </div>

      <div className="report-controls">
        <h3>Select Report Type</h3>
        <div className="report-buttons">
          <button
            className="report-btn"
            onClick={() => fetchReportData('Employee Performance')}
          >
            Employee Performance
          </button>
          <button
            className="report-btn"
            onClick={() => fetchReportData('Attraction Analytics')}
          >
            Attraction Analytics
          </button>
          <button
            className="report-btn"
            onClick={() => fetchReportData('Financial Summary')}
          >
            Financial Summary
          </button>
        </div>
      </div>

      <div className="report-display">
        {loading && <p className="loading">Loading report data...</p>}

        {error && <p className="error-message">{error}</p>}

        {!loading && !error && !reportData && (
          <div className="report-placeholder">
            <p>Select a report type to generate data</p>
          </div>
        )}

        {!loading && !error && reportData && (
          <div className="report-content">
            <h3>{reportData.reportType} Report</h3>
            <p>Generated on: {reportData.date}</p>

            <table className="report-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {reportData.data.map((item, index) => (
                  <tr key={index}>
                    <td>{item.category}</td>
                    <td>{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;