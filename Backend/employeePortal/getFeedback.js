const pool = require("../database");

async function getFeedback(req, res) {
    try {

        const [feedback] = await pool.execute(
            "SELECT C.first_name, C.last_name, F.feedback_date, F.rating_comments, F.feedback_type FROM customers as C, feedback as F WHERE C.customer_id = F.customer_id"
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