const pool = require("../database");

async function getFeedback(req, res) {
    try {

        const [feedback] = await pool.execute(
            "SELECT * FROM feedback"
        );
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(feedback));
        
    } catch (error) {
        console.error("Error fetching feedbacks:", error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ 
            message: "Internal Server Error", 
            error: error.message 
        }));
    }
}

module.exports = {
    getFeedback
};