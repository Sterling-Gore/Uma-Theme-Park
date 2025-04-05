const pool = require('../../database');

const generateFinanceReport = async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const reportType = url.searchParams.get('reportType') || 'all';
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const groupBy = url.searchParams.get('groupBy') || 'none';

    try {
        const [sqlModeResult] = await pool.query('SELECT @@SESSION.sql_mode');
        const currentSqlMode = sqlModeResult[0]['@@SESSION.sql_mode'];

        const newSqlMode = currentSqlMode
            .split(',')
            .filter(mode => mode !== 'ONLY_FULL_GROUP_BY')
            .join(',');

        await pool.query(`SET SESSION sql_mode = '${newSqlMode}'`);

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

        try {
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
        } finally {
            await pool.query(`SET SESSION sql_mode = '${currentSqlMode}'`);
        }
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

// This function will generate both SELECT and GROUP BY expressions correctly
const getDateExpressions = (groupBy, dateField) => {
    switch (groupBy) {
        case 'daily':
            return {
                select: `DATE(${dateField}) as date`,
                groupBy: `DATE(${dateField})`
            };
        case 'weekly':
            return {
                select: `DATE_ADD(DATE(${dateField}), INTERVAL - WEEKDAY(${dateField}) DAY) as date`,
                groupBy: `YEARWEEK(${dateField}, 1)`
            };
        case 'monthly':
            return {
                select: `DATE_FORMAT(${dateField}, '%Y-%m-01') as date`,
                groupBy: `DATE_FORMAT(${dateField}, '%Y-%m')`
            };
        case 'yearly':
            return {
                select: `DATE_FORMAT(${dateField}, '%Y-01-01') as date`,
                groupBy: `YEAR(${dateField})`
            };
        case 'none':
        default:
            return {
                select: `DATE(${dateField}) as date`,
                groupBy: `DATE(${dateField})`
            };
    }
};

const getTicketData = async (startDate, endDate, groupBy) => {
    const dateExpr = getDateExpressions(groupBy, 'purchase_date');

    let query = `
    SELECT 
      ${dateExpr.select}, 
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

    query += ` GROUP BY ${dateExpr.groupBy}`;
    query += ` ORDER BY date`;

    const [rows] = await pool.query(query, params);

    return rows.map(row => ({
        ...row,
        avg_ticket_price: row.number_of_tickets > 0 ? row.ticket_sales / row.number_of_tickets : 0
    }));
};


const getMerchandiseData = async (startDate, endDate, groupBy) => {
    const dateExpr = getDateExpressions(groupBy, 'purchase_date');

    let query = `
    SELECT 
      ${dateExpr.select}, 
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

    query += ` GROUP BY ${dateExpr.groupBy}`;
    query += ` ORDER BY date`;

    const [rows] = await pool.query(query, params);

    return rows.map(row => ({
        ...row,
        avg_item_price: row.items_sold > 0 ? row.merchandise_sales / row.items_sold : 0
    }));
};


const getMaintenanceData = async (startDate, endDate, groupBy) => {
    const dateExpr = getDateExpressions(groupBy, 'maintenance_date');

    let query = `
    SELECT 
      ${dateExpr.select},  
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

    query += ` GROUP BY ${dateExpr.groupBy}`;
    query += ` ORDER BY date`;

    const [rows] = await pool.query(query, params);

    return rows;
};


const getCombinedReport = async (startDate, endDate, groupBy) => {
    const ticketData = await getTicketData(startDate, endDate, groupBy);
    const merchandiseData = await getMerchandiseData(startDate, endDate, groupBy);
    const maintenanceData = await getMaintenanceData(startDate, endDate, groupBy);

    const dateMap = new Map();

    const getDate = (dateValue) => {
        if (typeof dateValue != 'string') {
            return dateValue.toISOString().split('T')[0];
        } else {
            return dateValue;
        }
    }

    // Process ticket data
    ticketData.forEach(record => {
        //console.log(typeof record.date)
        const dateKey = getDate(record.date);
        //const dateKey = record.date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        if (!dateMap.has(dateKey)) {
            dateMap.set(dateKey, {
                date: record.date,
                ticket_sales: 0,
                merchandise_sales: 0,
                maintenance_costs: 0,
                total_sales: 0,
                profit: 0
            });
        }

        const entry = dateMap.get(dateKey);
        entry.ticket_sales = record.ticket_sales || 0;
        entry.total_sales += record.ticket_sales || 0;
        entry.profit = entry.total_sales - entry.maintenance_costs;
    });

    merchandiseData.forEach(record => {
        const dateKey = getDate(record.date);
        if (!dateMap.has(dateKey)) {
            dateMap.set(dateKey, {
                date: record.date,
                ticket_sales: 0,
                merchandise_sales: 0,
                maintenance_costs: 0,
                total_sales: 0,
                profit: 0
            });
        }

        const entry = dateMap.get(dateKey);
        entry.merchandise_sales = record.merchandise_sales || 0;
        entry.total_sales = entry.ticket_sales + entry.merchandise_sales;
        entry.profit = entry.total_sales - entry.maintenance_costs;
    });

    maintenanceData.forEach(record => {
        const dateKey = getDate(record.date);
        if (!dateMap.has(dateKey)) {
            dateMap.set(dateKey, {
                date: record.date,
                ticket_sales: 0,
                merchandise_sales: 0,
                maintenance_costs: 0,
                total_sales: 0,
                profit: 0
            });
        }

        const entry = dateMap.get(dateKey);
        entry.maintenance_costs = record.maintenance_costs || 0;
        entry.profit = entry.total_sales - entry.maintenance_costs;
    });

    const combinedData = Array.from(dateMap.values())
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    return combinedData;
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

    //console.log(rows[0].totalMaintenanceCosts);

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


//I don't think we are going to need this function in the future. Leaving it in here just in case.
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