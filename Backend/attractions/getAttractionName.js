const pool = require("../database");

async function getAttractionName(req, res) {
    try {

        const [attractions] = await pool.execute(
            "SELECT attraction_id, attraction_name FROM theme_park.attractions"
        );
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(attractions));
        
    } catch (error) {
        console.error("Error fetching attractions:", error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ 
            message: "Internal Server Error", 
            error: error.message 
        }));
    }
}

module.exports = {
    getAttractionName
};