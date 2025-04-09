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

    // 🔄 Combine ticket + food pass data by visit date
    const combinedVisitData = (() => {
        if (!report) return [];

        const ticketMap = new Map();
        report.ticketDetails.forEach(entry => {
            ticketMap.set(entry.date, {
                date: entry.date,
                standards: entry.standards,
                children: entry.children,
                seniors: entry.seniors,
                total: entry.total,
                food_passes: 0
            });
        });

        report.foodPassBreakdown.forEach(entry => {
            if (ticketMap.has(entry.date)) {
                ticketMap.get(entry.date).food_passes = entry.food_passes;
            } else {
                ticketMap.set(entry.date, {
                    date: entry.date,
                    standards: 0,
                    children: 0,
                    seniors: 0,
                    total: 0,
                    food_passes: entry.food_passes
                });
            }
        });

        return Array.from(ticketMap.values()).sort((a, b) => new Date(a.date) - new Date(b.date));
    })();

    return (
        <div className="attract-report">
            <h1 className="report-title">Attraction Reports</h1>
            <p className="report-description">Access and generate reports.</p>

            <div className="filters">
                <div className="filter-group">
                    <label>Start Date</label>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="filter-group">
                    <label>End Date</label>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
                <div className="button-group">
                    <button className="btn btn-primary" onClick={fetchReport}>Generate Report</button>
                    <button className="btn btn-secondary" onClick={() => setActiveTab('dashboard')}>Back to Dashboard</button>
                </div>
            </div>

            {loading && <p className="loading-text">Generating report...</p>}
            {error && <p className="error-text">{error}</p>}

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
                            <p className="value">{report.ticketBreakdown?.standards || 0}</p>
                        </div>
                        <div className="summary-card">
                            <p className="label">Children Tickets</p>
                            <p className="value">{report.ticketBreakdown?.children || 0}</p>
                        </div>
                        <div className="summary-card">
                            <p className="label">Senior Tickets</p>
                            <p className="value">{report.ticketBreakdown?.seniors || 0}</p>
                        </div>
                        <div className="summary-card">
                            <p className="label">Total Food Passes</p>
                            <p className="value">{report.totalFoodPasses}</p>
                        </div>
                        <div className="summary-card">
                            <p className="label">Most Popular Ticket</p>
                            <p className="value">{report.popularTicketType?.type || 'N/A'}</p>
                        </div>
                    </div>

                    <h2 className="section-title">Visitor Details by Date</h2>
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Standard</th>
                                <th>Children</th>
                                <th>Seniors</th>
                                <th>Total Tickets</th>
                                <th>Food Passes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {combinedVisitData.map((row, idx) => (
                                <tr key={idx}>
                                    <td>{new Date(row.date).toLocaleDateString()}</td>
                                    <td>{row.standards}</td>
                                    <td>{row.children}</td>
                                    <td>{row.seniors}</td>
                                    <td>{row.total}</td>
                                    <td>{row.food_passes}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <h2 className="section-title">Top 5 Attractions</h2>
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <th>Attraction</th>
                                <th>Visits</th>
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
                                <th>Total Visits</th>
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
