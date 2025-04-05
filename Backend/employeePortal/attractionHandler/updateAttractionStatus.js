const pool = require("../../database");


async function updateAttractionStatus(req, res) {
    try {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const {id, newStatus, confirmChanges} = JSON.parse(body);
                const getActiveMaintenanceQuery = "select * FROM theme_park.maintenance_logs WHERE attraction_id = ? AND currently_under_maintenance = true" 
                const [rows] = await pool.execute(getActiveMaintenanceQuery, [id]);
                if(rows.length !== 0 && !confirmChanges && newStatus === "Open")
                {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ message: "Success", status: "Blocked"}));
                }
                if(rows.length !== 0 && confirmChanges && newStatus === "Open")
                {
                    const updateMaintenanceStatus= "UPDATE theme_park.maintenance_logs SET currently_under_maintenance = false WHERE attraction_id = ? AND currently_under_maintenance = true";
                    const [attractionCapacityUpdateResult] = await pool.execute(updateMaintenanceStatus, [id]);
                }

                const updateAttractionStatusQuery= "UPDATE theme_park.attractions SET attraction_status = ? WHERE attraction_id = ?";
                const [attractionCapacityUpdateResult] = await pool.execute(updateAttractionStatusQuery, [newStatus, id]);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: "Success", status: "Success"}));
            } catch (error) {
                console.error("Error parsing request body:", error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: "Invalid request data" }));
            }
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: "Internal Server Error" }));
    }
}

module.exports = {
    updateAttractionStatus
};
