const { v4: uuidv4 } = require('uuid');
const pool = require("../../database");


async function createMaintenanceLog(req, res) {
    try {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                console.log(body);
                const maintenanceLogID = uuidv4();  
                const {name, description, cost, expectedDate, ID, isAttraction} = JSON.parse(body);
                const today = new Date(); 
                const attractionID = isAttraction ? ID : null;
                const diningID = isAttraction ? null : ID;
                const createMaintenanceLogQuery = "INSERT INTO theme_park.maintenance_logs (log_id, maintenance_name, maintenance_description, maintenance_cost, maintenance_date, expected_completion_date, attraction_id, dining_id, isAttraction, currently_under_maintenance) VALUES (?,?,?,?,?,?,?,?,?,?);";
                const [createMaintenanceLogResponse] = await pool.execute(createMaintenanceLogQuery, [maintenanceLogID, name, description, cost, today, expectedDate, attractionID, diningID, isAttraction, true]);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ success: true, message: "Success"}));
            } catch (error) {
                console.error("Error parsing request body:", error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({success: false,  message: "Invalid request data" }));
            }
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: false, message: "Internal Server Error" }));
    }
}

module.exports = {
    createMaintenanceLog
};
