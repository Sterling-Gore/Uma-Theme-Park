import React, { useState } from "react";
import './attractReport.css';

const AttractReport = ({ setActiveTab }) => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const fetchReport = async () => {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({ reportType: 'all' });
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);

        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_API}/generateParkReport?${params}`,
                {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            const data = await response.json();
            if (data.success) {
                setReport(data.results);
            } else {
                setError(data.message || 'Failed to generate report.');
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setError('An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setStartDate('');
        setEndDate('');
        setError(null);
    };

    return (
        <div className="reports">
            <div className="content-header">
                <h2>Attraction Reports</h2>
            </div>
            <div className="report-controls">
                <div className="filter-form">
                    <p className="report-description">Access and generate reports.</p>

                    <div className="filter-row">
                        <div className="filter-group">
                            <label>Start Date</label>
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        </div>
                        <div className="filter-group">
                            <label>End Date</label>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </div>
                        
                    </div>
                    
                    <div className="filter-actions">
                        <button onClick={fetchReport} className="generate-btn">
                            Generate Report
                        </button>
                        <button type="button" className="reset-btn" onClick={handleReset}>
                            Reset Filters
                        </button>
                    </div>
                </div>
            </div>

            {loading && <p className="loading-text">Generating report...</p>}
            {error && <p className="error-text">{error}</p>}
            {!loading && !error && !report && (
                <div className="report-placeholder">
                    <p>Select filters and click "Generate Report" to view Attraction data</p>
                </div>
            )}

            {report && (
                <div className="report-output">
                    <h2 className="section-title">Summary</h2>
                    <div className="summary-grid">
                        <div className="summary-card">
                            <p className="label">Total Visitors</p>
                            <p className="value">{report.totalVisitors}</p>
                        </div>
                        <div className="summary-card">
    <p className="label">Standard Tickets</p>
    <p className="value">{report.ticketBreakdown.standards || 0}</p>
</div>
<div className="summary-card">
    <p className="label">Children Tickets</p>
    <p className="value">{report.ticketBreakdown.children || 0}</p>
</div>
<div className="summary-card">
    <p className="label">Senior Tickets</p>
    <p className="value">{report.ticketBreakdown.seniors || 0}</p>
</div>

                        <div className="summary-card">
    <p className="label">Total Food Passes</p>
    <p className="value">{report.totalFoodPasses}</p>
</div>

                        <div className="summary-card">
                            <p className="label">Most Popular Ticket</p>
                            <p className="value">{report.popularTicketType.type}</p>
                        </div>
                    </div>

                    <h2 className="section-title">Top 5 Attractions</h2>
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <th>Attraction</th>
                                <th>Number of Interests</th>
                            </tr>
                        </thead>
                        <tbody>
                            {report.popularAttractions.map((a, idx) => (
                                <tr key={idx}>
                                    <td>{a.attraction_name}</td>
                                    <td>{a.visit_count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <h2 className="section-title">All Attraction Visits</h2>
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <th>Attraction</th>
                                <th>Total Number of Interests</th>
                            </tr>
                        </thead>
                        <tbody>
                            {report.attractionVisits.map((a, idx) => (
                                <tr key={idx}>
                                    <td>{a.attraction_name}</td>
                                    <td>{a.visits}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AttractReport;
