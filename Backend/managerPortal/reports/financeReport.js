const pool = require('../../database');

const generateFinanceReport = async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const reportType = url.searchParams.get('reportType') || 'all';
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const groupBy = url.searchParams.get('groupBy') || 'none';

    try {
        let data = [];
        let summary = {};

        if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                message: 'Start date cannot be after end date'
            }));
            return;
        }

        switch (reportType) {
            case 'tickets':
                data = await getTicketData(startDate, endDate, groupBy);
                summary = await getTicketSummary(startDate, endDate);
                break;
            case 'merchandise':
                data = await getMerchandiseData(startDate, endDate, groupBy);
                summary = await getMerchandiseSummary(startDate, endDate);
                break;
            case 'maintenance':
                data = await getMaintenanceData(startDate, endDate, groupBy);
                summary = await getMaintenanceSummary(startDate, endDate);
                break;
            case 'all':
            default:
                data = await getCombinedReport(startDate, endDate, groupBy);
                summary = await getCombinedSummary(startDate, endDate);
                break;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            data,
            summary
        }));
    } catch (error) {
        console.error('Error generating finance report:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: false,
            message: 'Failed to generate finance report',
            error: error.message
        }));
    }
};

const getTicketData = async (startDate, endDate, groupBy) => {
    let query = `
  SELECT 
    DATE(purchase_date) as date, 
    SUM(total_cost) as ticket_sales,
    SUM(number_of_standards + number_of_children + number_of_seniors) as number_of_tickets
  FROM ticket_receipt
  WHERE 1=1
`;

    const params = [];

    if (startDate) {
        query += ` AND purchase_date >= ?`;
        params.push(startDate);
    }

    if (endDate) {
        query += ` AND purchase_date <= ?`;
        params.push(endDate);
    }

    query += getGroupByClause(groupBy, 'purchase_date');


    query += ` ORDER BY date`;

    const [rows] = await pool.query(query, params);

    return rows.map(row => ({
        ...row,
        avg_ticket_price: row.number_of_tickets > 0 ? row.ticket_sales / row.number_of_tickets : 0
    }));
};


const getMerchandiseData = async (startDate, endDate, groupBy) => {
    let query = `
    SELECT 
      DATE(purchase_date) as date, 
      CAST(SUM(total_cost) as SIGNED) as merchandise_sales,
      SUM(total_items_sold) as items_sold
    FROM merchandise_receipt
    WHERE 1=1
  `;


    const params = [];

    if (startDate) {
        query += ` AND purchase_date >= ?`;
        params.push(startDate);
    }

    if (endDate) {
        query += ` AND purchase_date <= ?`;
        params.push(endDate);
    }

    query += getGroupByClause(groupBy, 'purchase_date');

    query += ` ORDER BY date`;

    const [rows] = await pool.query(query, params);

    //console.log(typeof row.merchandise_sales);

    return rows.map(row => ({
        ...row,
        avg_item_price: row.items_sold > 0 ? row.merchandise_sales / row.items_sold : 0
    }));
};


const getMaintenanceData = async (startDate, endDate, groupBy) => {
    let query = `
  SELECT 
    DATE(maintenance_date) as date,  
    SUM(maintenance_cost) as maintenance_costs,
    COUNT(*) as maintenance_count
  FROM maintenance_logs
  WHERE 1=1
`;

    const params = [];

    if (startDate) {
        query += ` AND maintenance_date >= ?`;
        params.push(startDate);
    }

    if (endDate) {
        query += ` AND maintenance_date <= ?`;
        params.push(endDate);
    }

    query += getGroupByClause(groupBy, 'maintenance_date');

    query += ` ORDER BY date`;

    const [rows] = await pool.query(query, params);

    return rows;
};


const getCombinedReport = async (startDate, endDate, groupBy) => {
    let dateField;
    let groupField;

    switch (groupBy) {
        case 'daily':
            groupField = 'DATE(coalesce(t.purchase_date, m.purchase_date, ml.maintenance_date))';
            dateField = 'DATE(coalesce(t.purchase_date, m.purchase_date, ml.maintenance_date)) as date';
            break;
        case 'weekly':
            groupField = 'YEARWEEK(coalesce(t.purchase_date, m.purchase_date, ml.maintenance_date), 1)';
            dateField = 'DATE_ADD(DATE(coalesce(t.purchase_date, m.purchase_date, ml.maintenance_date)), INTERVAL - WEEKDAY(coalesce(t.purchase_date, m.purchase_date, ml.maintenance_date)) DAY) as date';
            break;
        case 'monthly':
            groupField = 'DATE_FORMAT(coalesce(t.purchase_date, m.purchase_date, ml.maintenance_date), "%Y-%m")';
            dateField = 'DATE_FORMAT(coalesce(t.purchase_date, m.purchase_date, ml.maintenance_date), "%Y-%m-01") as date';
            break;
        case 'yearly':
            groupField = 'YEAR(coalesce(t.purchase_date, m.purchase_date, ml.maintenance_date))';
            dateField = 'DATE_FORMAT(coalesce(t.purchase_date, m.purchase_date, ml.maintenance_date), "%Y-01-01") as date';
            break;
        case 'none':
        default:
            groupField = 'DATE(coalesce(t.purchase_date, m.purchase_date, ml.maintenance_date))';
            dateField = 'DATE(coalesce(t.purchase_date, m.purchase_date, ml.maintenance_date)) as date';
            break;
    }

    let query = `
    SELECT 
      ${dateField},
      COALESCE(SUM(t.total_cost), 0) as ticket_sales,
      CAST(COALESCE(SUM(m.total_cost), 0) AS SIGNED) as merchandise_sales,
      COALESCE(SUM(t.total_cost), 0) + COALESCE(SUM(m.total_cost), 0) as total_sales,
      COALESCE(SUM(ml.maintenance_cost), 0) as maintenance_costs,
      COALESCE(SUM(t.total_cost), 0) + COALESCE(SUM(m.total_cost), 0) - COALESCE(SUM(ml.maintenance_cost), 0) as profit
    FROM 
        (
        SELECT DISTINCT DATE(purchase_date) as purchase_date FROM ticket_receipt
        UNION 
        SELECT DISTINCT DATE(purchase_date) as purchase_date FROM merchandise_receipt
        UNION 
        SELECT DISTINCT DATE(maintenance_date) as purchase_date FROM maintenance_logs
      ) as dates
    LEFT JOIN ticket_receipt t ON DATE(dates.purchase_date) = DATE(t.purchase_date)
    LEFT JOIN merchandise_receipt m ON DATE(dates.purchase_date) = DATE(m.purchase_date)
    LEFT JOIN maintenance_logs ml ON DATE(dates.purchase_date) = DATE(ml.maintenance_date)
    WHERE 1=1
  `;

    const params = [];

    if (startDate) {
        query += ` AND (
      (t.purchase_date IS NOT NULL AND t.purchase_date >= ?) OR
      (m.purchase_date IS NOT NULL AND m.purchase_date >= ?) OR
      (ml.maintenance_date IS NOT NULL AND ml.maintenance_date >= ?)
    )`;
        params.push(startDate, startDate, startDate);
    }

    if (endDate) {
        query += ` AND (
      (t.purchase_date IS NOT NULL AND t.purchase_date <= ?) OR
      (m.purchase_date IS NOT NULL AND m.purchase_date <= ?) OR
      (ml.maintenance_date IS NOT NULL AND ml.maintenance_date <= ?)
    )`;
        params.push(endDate, endDate, endDate);
    }

    query += ` GROUP BY ${groupField}`;

    query += ` ORDER BY date`;

    const [rows] = await pool.query(query, params);

    //console.log(rows);

    return rows;
};


const getTicketSummary = async (startDate, endDate) => {
    let query = `
    SELECT 
      COALESCE(SUM(total_cost), 0) as totalTicketSales,
      COUNT(*) as totalTransactions,
      SUM(number_of_standards + number_of_children + number_of_seniors) as totalTickets
    FROM ticket_receipt
    WHERE 1=1
  `;

    const params = [];

    if (startDate) {
        query += ` AND purchase_date >= ?`;
        params.push(startDate);
    }

    if (endDate) {
        query += ` AND purchase_date <= ?`;
        params.push(endDate);
    }

    const [rows] = await pool.query(query, params);

    return {
        totalTicketSales: rows[0].totalTicketSales,
        totalTransactions: rows[0].totalTransactions,
        totalTickets: rows[0].totalTickets,
        avgTicketPrice: rows[0].totalTickets > 0 ? rows[0].totalTicketSales / rows[0].totalTickets : 0
    };
};


const getMerchandiseSummary = async (startDate, endDate) => {
    let query = `
    SELECT 
      COALESCE(SUM(total_cost), 0) as totalMerchandiseSales,
      COUNT(*) as totalTransactions,
      SUM(total_items_sold) as totalItems
    FROM merchandise_receipt
    WHERE 1=1
  `;

    const params = [];

    if (startDate) {
        query += ` AND purchase_date >= ?`;
        params.push(startDate);
    }

    if (endDate) {
        query += ` AND purchase_date <= ?`;
        params.push(endDate);
    }

    const [rows] = await pool.query(query, params);

    return {
        totalMerchandiseSales: rows[0].totalMerchandiseSales,
        totalTransactions: rows[0].totalTransactions,
        totalItems: rows[0].totalItems,
        avgItemPrice: rows[0].totalItems > 0 ? rows[0].totalMerchandiseSales / rows[0].totalItems : 0
    };
};


const getMaintenanceSummary = async (startDate, endDate) => {
    let query = `
    SELECT 
      COALESCE(SUM(maintenance_cost), 0) as totalMaintenanceCosts,
      COUNT(*) as totalMaintenanceItems
    FROM maintenance_logs
    WHERE 1=1
  `;

    const params = [];

    if (startDate) {
        query += ` AND maintenance_date >= ?`;
        params.push(startDate);
    }

    if (endDate) {
        query += ` AND maintenance_date <= ?`;
        params.push(endDate);
    }

    const [rows] = await pool.query(query, params);

    console.log(rows[0].totalMaintenanceCosts);

    return {
        totalMaintenanceCosts: rows[0].totalMaintenanceCosts,
        totalMaintenanceItems: rows[0].totalMaintenanceItems,
        avgMaintenanceCost: rows[0].totalMaintenanceItems > 0 ? rows[0].totalMaintenanceCosts / rows[0].totalMaintenanceItems : 0
    };
};


const getCombinedSummary = async (startDate, endDate) => {
    const ticketSummary = await getTicketSummary(startDate, endDate);
    const merchandiseSummary = await getMerchandiseSummary(startDate, endDate);
    const maintenanceSummary = await getMaintenanceSummary(startDate, endDate);

    // console.log('Summary data types:', {
    //     ticketSales: typeof ticketSummary.totalTicketSales,
    //     merchSales: typeof merchandiseSummary.totalMerchandiseSales,
    //     maintCosts: typeof maintenanceSummary.totalMaintenanceCosts,
    //     ticketValue: ticketSummary.totalTicketSales,
    //     merchValue: merchandiseSummary.totalMerchandiseSales,
    //     maintValue: maintenanceSummary.totalMaintenanceCosts,
    //     totalSales: ticketSummary.totalTicketSales + Number(merchandiseSummary.totalMerchandiseSales)
    //   });

    return {
        totalTicketSales: ticketSummary.totalTicketSales,
        totalMerchandiseSales: merchandiseSummary.totalMerchandiseSales,
        totalSales: ticketSummary.totalTicketSales + Number(merchandiseSummary.totalMerchandiseSales),
        totalMaintenanceCosts: maintenanceSummary.totalMaintenanceCosts,
        totalProfit: (ticketSummary.totalTicketSales + Number(merchandiseSummary.totalMerchandiseSales)) - maintenanceSummary.totalMaintenanceCosts
    };
};


const getGroupByClause = (groupBy, dateField) => {
    switch (groupBy) {
        case 'daily':
            return ` GROUP BY DATE(${dateField})`;
        case 'weekly':
            return ` GROUP BY YEARWEEK(${dateField}, 1)`;
        case 'monthly':
            return ` GROUP BY DATE_FORMAT(${dateField}, '%Y-%m')`;
        case 'yearly':
            return ` GROUP BY YEAR(${dateField})`;
        case 'none':
        default:
            return ` GROUP BY DATE(${dateField})`;
    }
};

module.exports = {
    generateFinanceReport
};