const pool = require('../database');

async function getTickets(userID) {
    try {
        const sqlQuery = `
            SELECT 
                t.ticket_receipt_id, 
                c.first_name, 
                t.total_cost,
                t.number_of_days,
                t.number_of_standards,
                t.number_of_children,
                t.number_of_seniors,
                t.purchase_date,
                td.ticket_date,
                td.includes_food_pass
            FROM 
                ticket_receipt AS t, 
                customers AS c, 
                ticket_dates AS td 
            WHERE 
                t.customer_id = c.customer_id
                AND t.ticket_receipt_id = td.ticket_receipt_id
                AND c.customer_id = ?
            ORDER BY 
                td.ticket_date desc`;

        const [rows] = await pool.query(sqlQuery, [userID]);
        return rows;
    } catch (error) {
        console.error('Error fetching tickets:', error);
        throw error;
    }
}

async function getTicketOrders(req, res) {
    let body = '';

    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            const data = JSON.parse(body);
            const userID = data.customer_id;

            if (!userID) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Customer ID is required' }));
                return;
            }

            const tickets = await getTickets(userID);

            if (tickets.length === 0) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'No tickets found for this customer' }));
                return;
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                data: tickets
            }));

        } catch (error) {
            console.error('Error processing request:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                error: 'Server error processing ticket request'
            }));
        }
    });
}

module.exports = {
    getTicketOrders
}