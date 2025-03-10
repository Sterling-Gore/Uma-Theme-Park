const { v4: uuidv4 } = require('uuid');
const pool = require('../database');

async function submitFeedback(req, res) {
    try {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const { customer_id, rating_comments, feedback_type } = JSON.parse(body);
                
                // Validate required fields
                if (!customer_id || !rating_comments || !feedback_type) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ 
                        success: false, 
                        message: "Missing required fields" 
                    }));
                }

                // Generate a new UUID for the feedback
                const feedback_id = uuidv4();
                
                // Get current date for feedback_date
                const feedback_date = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
                
                // Insert feedback into database
                const [result] = await pool.execute(
                    "INSERT INTO theme_park.feedback (feedback_id, customer_id, feedback_date, rating_comments, feedback_type) VALUES (?, ?, ?, ?, ?)",
                    [feedback_id, customer_id, feedback_date, rating_comments, feedback_type]
                );

                console.log("Feedback submitted:", result);
                
                res.writeHead(201, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ 
                    success: true, 
                    message: "Feedback submitted successfully", 
                    feedback_id 
                }));
            } catch (error) {
                console.error("Error processing feedback submission:", error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ 
                    success: false, 
                    message: "Invalid request data",
                    error: error.message 
                }));
            }
        });
    } catch (error) {
        console.error("Unexpected error in feedback submission:", error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ 
            success: false, 
            message: "Internal Server Error",
            error: error.message 
        }));
    }
}

module.exports = {
    submitFeedback
};