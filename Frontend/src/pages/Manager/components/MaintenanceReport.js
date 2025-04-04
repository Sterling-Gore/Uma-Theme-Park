import React, { useState, useEffect } from 'react';
import "../ManagerPortal.css"

const MaintenanceReport = ({ setActiveTab }) => {
    // State for form inputs
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [dateType, setDateType] = useState('all');
    const [reportType, setReportType] = useState('all');
    const [orderBy, setOrderBy] = useState('start');

    // State for report data
    const [reportData, setReportData] = useState(null);
    const [overviewData, setOverviewData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [summary, setSummary] = useState(null);

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    // Fetch report data from backend
    const fetchReportData = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Create request parameters
            const params = new URLSearchParams({
                reportType,
                orderBy,
                dateType,
                ...(startDate && { startDate }),
                ...(endDate && { endDate })
            });

            // Fetch data from the backend
            const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/maintenanceReport?${params}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                setReportData(data.data);
                setOverviewData(data.summary);
                setSummary(data.combinedSummary);
            } else {
                setError(data.message || 'Failed to fetch report data');
            }
        } catch (err) {
            console.error('Error fetching report data:', err);
            setError('Failed to load report data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Get column headers based on report type
    const getColumnHeaders = () => {
        const columns = {
            maintenance_log: 'Maintenance Log',
            facility: 'Facility',
            cost: 'Maintenance Cost',
            start_date: 'Maintenance Start Date',
            end_date: 'Maintenance End Date',
            expected_end_date: 'Expected Maintenance End Date',
            expected_difference: 'Expected To Actual End Date Difference'
            
        }
        return columns;
        const baseColumns = {
            date: 'Date',
        };

        const typeColumns = {
            all: {
                ticket_sales: 'Ticket Sales',
                merchandise_sales: 'Merchandise Sales',
                total_sales: 'Total Sales',
                maintenance_costs: 'Maintenance Costs',
                profit: 'Profit'
            },
            tickets: {
                ticket_sales: 'Ticket Sales',
                number_of_tickets: 'Number of Tickets',
                avg_ticket_price: 'Avg Ticket Price'
            },
            merchandise: {
                merchandise_sales: 'Merchandise Sales',
                items_sold: 'Items Sold',
                avg_item_price: 'Avg Item Price'
            },
            maintenance: {
                maintenance_costs: 'Maintenance Costs',
                maintenance_count: 'Maintenance Count'
            }
        };

        return { ...baseColumns, ...typeColumns[reportType] };
    };

    // Reset form and data
    const handleReset = () => {
        setStartDate('');
        setEndDate('');
        setDateType('all');
        setReportType('all');
        setOrderBy('start');
        setReportData(null);
        setSummary(null);
        setError(null);
    };

    return (
        <div className="reports">
            <div className="content-header">
                <h2>Maintenance Reports</h2>
            </div>

            <div className="report-controls">
                <form onSubmit={fetchReportData} className="filter-form">
                    <div className="filter-row">
                        <div className="filter-group">
                            <label htmlFor="startDate">Start Date</label>
                            <input
                                type="date"
                                id="startDate"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>

                        <div className="filter-group">
                            <label htmlFor="endDate">End Date</label>
                            <input
                                type="date"
                                id="endDate"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>

                        <div className="filter-group">
                            <label htmlFor="dateType">Date Type</label>
                            <select
                                id="dateType"
                                value={dateType}
                                onChange={(e) => setDateType(e.target.value)}
                            >
                                <option value="all">All Maintenance Dates</option>
                                <option value="start">Maintenance Start Dates</option>
                                <option value="end">Maintenance End Dates</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label htmlFor="reportType">Report Type</label>
                            <select
                                id="reportType"
                                value={reportType}
                                onChange={(e) => setReportType(e.target.value)}
                            >
                                <option value="all">All Maintenance Data</option>
                                <option value="attraction">Attraction Maintenance Only</option>
                                <option value="dining">Dining Maintenance Only</option>
                            </select>
                        </div>


                        <div className="filter-group">
                            <label htmlFor="orderBy">Order By</label>
                            <select
                                id="orderBy"
                                value={orderBy}
                                onChange={(e) => setOrderBy(e.target.value)}
                            >
                                <option value="start">Start Date</option>
                                <option value="end">End Date</option>
                            </select>
                        </div>
                    </div>

                    <div className="filter-actions">
                        <button type="submit" className="generate-btn">
                            Generate Report
                        </button>
                        <button type="button" className="reset-btn" onClick={handleReset}>
                            Reset Filters
                        </button>
                    </div>
                </form>
            </div>

            <div className="report-display">
                {loading && <p className="loading">Loading maintenance data...</p>}

                {error && <p className="error-message">{error}</p>}

                {!loading && !error && !reportData && (
                    <div className="report-placeholder">
                        <p>Select filters and click "Generate Report" to view maintenance data</p>
                    </div>
                )}

                {!loading && !error && reportData && (
                    <div className="report-content">
                        <h3>
                            {reportType === 'all' && 'General Maintenance Report'}
                            {reportType === 'attraction' && 'Attraction Maintenance Report'}
                            {reportType === 'dining' && 'Dining Maintenance Report'}
                        </h3>

                        <p className="report-period">
                            Period: {startDate ? formatDate(startDate) : 'All history'}
                            {endDate ? ` to ${formatDate(endDate)}` : ''}
                        </p>

                        {summary && (
                            <div className="report-summary">
                                <h4>Summary</h4>
                                <div className="summary-grid">
                                    {reportType === 'all' || reportType === 'attraction' ? (
                                        <div className="summary-item">
                                            <span className="summary-label">Total Attraction Maintenance Logs:</span>
                                            <span className="summary-value">${summary && summary.totalTicketSales ? summary.totalTicketSales : '0.00'}</span>
                                        </div>
                                    ) : null}

                                    {reportType === 'all' || reportType === 'merchandise' ? (
                                        <div className="summary-item">
                                            <span className="summary-label">Total Merchandise Sales:</span>
                                            <span className="summary-value">${summary && summary.totalMerchandiseSales ? summary.totalMerchandiseSales : '0.00'}</span>
                                        </div>
                                    ) : null}

                                    {reportType === 'all' || reportType === 'maintenance' ? (
                                        <div className="summary-item">
                                            <span className="summary-label">Total Maintenance Costs:</span>
                                            <span className="summary-value">${summary && summary.totalMaintenanceCosts ? summary.totalMaintenanceCosts : '0.00'}</span>
                                        </div>
                                    ) : null}

                                    {reportType === 'all' && (
                                        <div className="summary-item">
                                            <span className="summary-label">Total Profit:</span>
                                            <span className="summary-value">${summary && summary.totalProfit ? summary.totalProfit : '0.00'}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="table-container">
                            <table className="report-table">
                                <thead>
                                    <tr>
                                        {Object.values(getColumnHeaders()).map((header, index) => (
                                            <th key={index}>{header}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.length > 0 ? (
                                        reportData.map((record, index) => (
                                            <tr key={index}>
                                                {Object.keys(getColumnHeaders()).map((key, colIndex) => (
                                                    <td key={colIndex}>
                                                        {key === 'date' ? formatDate(record[key]) :
                                                            typeof record[key] === 'number' ?
                                                                key.includes('number') || key.includes('count') ?
                                                                    record[key] : `$${record[key].toFixed(2)}` :
                                                                record[key] || '-'}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={Object.keys(getColumnHeaders()).length} className="no-results">
                                                No data found for the selected filters
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MaintenanceReport;