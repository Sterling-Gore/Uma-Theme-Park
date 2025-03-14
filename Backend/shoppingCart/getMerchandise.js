const pool = require('../database');

async function pullData(){
    try{

        const sqlQuery = "SELECT M.merchandise_id, M.merchandise_name, M.merchandise_price, M.stock_amount FROM merchandise AS M;";
        const [rows] = await pool.execute(sqlQuery)
        return rows.length > 0 ? rows : [];
    }catch (err) {
        console.error("Database error:", err);
        throw err;
    }
}

async function getMerchandise(req, res){
    try {
        const merchandise = await pullData();
        
        if (!merchandise || merchandise.length === 0) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                message: "No merchandise found"
            }));
            return;
        }
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            data: merchandise,
            count: merchandise.length
        }));
    } catch (error) {
        console.error("Error in getMerchandise:", error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: false,
            message: "Internal server error",
            error: error.message
        }));
    }
}

module.exports = {
    getMerchandise
}