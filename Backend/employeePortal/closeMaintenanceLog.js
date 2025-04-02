const pool = require("../database");


async function closeMaintenanceLog(req, res) {
    try {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const {log_id} = JSON.parse(body);
                
                const closeMaintenanceLogQuery= "UPDATE theme_park.maintenance_logs SET currently_under_maintenance = false WHERE log_id = ?";
                const [closeMaintenanceLogResult] = await pool.execute(closeMaintenanceLogQuery, [log_id]);

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
    closeMaintenanceLog
};
