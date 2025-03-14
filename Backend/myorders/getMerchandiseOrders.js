const pool = require('../database');


async function getReceipt(userID) {
    const sqlQuery = 'SELECT * FROM merchandise_receipt WHERE customer_id = ?';
    const [rows] = await pool.execute(sqlQuery, [userID]);
    return rows;
}

async function getMerchandiseOrders(req, res) {
    let body = '';

    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            const data = JSON.parse(body);
            const userID = data.customerID;
            
            if (!userID) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Missing userID parameter' }));
                return;
            }
            
            const receipts = await getReceipt(userID);
      
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                success: true, 
                receipts: receipts 
            }));
        } catch (error) {
            console.error('Error processing request:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                success: false, 
                error: 'Server error', 
                message: error.message 
            }));
        }
    });
    
    req.on('error', (error) => {
        console.error('Request error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            success: false, 
            error: 'Server error', 
            message: error.message 
        }));
    });
}

module.exports = {
    getMerchandiseOrders
};