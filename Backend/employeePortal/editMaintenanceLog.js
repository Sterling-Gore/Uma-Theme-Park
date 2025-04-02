const pool = require("../database");


async function editMaintenanceLog(req, res) {
    try {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const {log_id, name, description, cost, expected_completion_date} = JSON.parse(body);
                
                const editMaintenanceLog= "UPDATE theme_park.maintenance_logs SET maintenance_name = ?, maintenance_description = ?, maintenance_cost = ?, expected_completion_date = ? WHERE log_id = ?";
                const [editMaintenanceLogResult] = await pool.execute(editMaintenanceLog, [name, description, cost, expected_completion_date, log_id]);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: "Success", success : true}));
            } catch (error) {
                console.error("Error parsing request body:", error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: "Invalid request data", success : false }));
            }
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: "Internal Server Error", success : false }));
    }
}

module.exports = {
    editMaintenanceLog
};
