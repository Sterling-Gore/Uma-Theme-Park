const pool = require("../database");

async function getDiningName(req, res) {
    try {

        const [dinings] = await pool.execute(
            "SELECT dining_id, dining_name FROM theme_park.dining"
        );
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(dinings));
        
    } catch (error) {
        console.error("Error fetching dinings:", error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ 
            message: "Internal Server Error", 
            error: error.message 
        }));
    }
}

module.exports = {
    getDiningName
};