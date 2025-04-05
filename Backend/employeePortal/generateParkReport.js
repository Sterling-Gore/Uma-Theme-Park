const pool = require('../database');

const generateParkReport = async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    try {
        const results = {
            totalVisitors: await getTotalVisitors(startDate, endDate),
            visitorsInRange: await getVisitorsInRange(startDate, endDate),
            popularAttractions: await getPopularAttractions(startDate,endDate),
            attractionVisits: await getAttractionVisits(startDate,endDate),
            totalTickets: await getTotalTickets(startDate, endDate),
            popularTicketType: await getPopularTicketType(startDate, endDate),
            totalFoodPasses: await getTotalFoodPasses(startDate, endDate)
        };

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, results }));
    } catch (error) {
        console.error('Error generating park report:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Failed to generate report', error: error.message }));
    }
};

const getTotalVisitors = async (startDate, endDate) => {
    let query = `SELECT SUM(number_of_standards + number_of_children + number_of_seniors) AS totalVisitors FROM ticket_receipt WHERE 1=1`;
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
    return rows[0].totalVisitors || 0;
};

const getVisitorsInRange = getTotalVisitors;

const getPopularAttractions = async (startDate, endDate) => {
    let query = `
        SELECT ai.attraction_name, COUNT(*) AS visit_count
        FROM attraction_interests ai
        JOIN ticket_receipt tr ON ai.ticket_receipt_id = tr.ticket_receipt_id
        WHERE 1=1
    `;
    const params = [];

    if (startDate) {
        query += ` AND tr.purchase_date >= ?`;
        params.push(startDate);
    }

    if (endDate) {
        query += ` AND tr.purchase_date <= ?`;
        params.push(endDate);
    }

    query += `
        GROUP BY ai.attraction_name
        ORDER BY visit_count DESC
        LIMIT 5
    `;

    const [rows] = await pool.query(query, params);
    return rows;
};


const getAttractionVisits = async (startDate, endDate) => {
    let query = `
        SELECT ai.attraction_name, COUNT(*) AS visits
        FROM attraction_interests ai
        JOIN ticket_receipt tr ON ai.ticket_receipt_id = tr.ticket_receipt_id
        WHERE 1=1
    `;
    const params = [];

    if (startDate) {
        query += ` AND tr.purchase_date >= ?`;
        params.push(startDate);
    }

    if (endDate) {
        query += ` AND tr.purchase_date <= ?`;
        params.push(endDate);
    }

    query += ` GROUP BY ai.attraction_name`;

    const [rows] = await pool.query(query, params);
    return rows;
};

const getTotalTickets = async (startDate, endDate) => {
    let query = `
        SELECT SUM(number_of_standards + number_of_children + number_of_seniors) AS totalTickets
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
    return rows[0].totalTickets || 0;
};

const getPopularTicketType = async (startDate, endDate) => {
    let query = `
        SELECT 
            SUM(number_of_standards) AS standards,
            SUM(number_of_children) AS children,
            SUM(number_of_seniors) AS seniors
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
    const ticketCounts = rows[0];

    const ticketTypes = Object.entries(ticketCounts).map(([type, count]) => ({ type, count }));
    ticketTypes.sort((a, b) => b.count - a.count);

    return ticketTypes[0];
};
const getTotalFoodPasses = async (startDate, endDate) => {
    let query = `
        SELECT COUNT(*) AS totalFoodPasses
        FROM ticket_dates td
        JOIN ticket_receipt tr ON td.ticket_receipt_id = tr.ticket_receipt_id
        WHERE td.includes_food_pass = 1
    `;
    const params = [];

    if (startDate) {
        query += ` AND tr.purchase_date >= ?`;
        params.push(startDate);
    }

    if (endDate) {
        query += ` AND tr.purchase_date <= ?`;
        params.push(endDate);
    }

    const [rows] = await pool.query(query, params);
    return rows[0].totalFoodPasses || 0;
};


module.exports = { generateParkReport };
