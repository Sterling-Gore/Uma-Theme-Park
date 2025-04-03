const pool = require('../database')

async function getData(userID) {
    const getActiveMaintenanceLog = `
        SELECT 
            M.log_id, 
            M.maintenance_name, 
            M.maintenance_description, 
            M.maintenance_cost, 
            M.maintenance_date, 
            M.expected_completion_date,
            COALESCE(M.attraction_id, M.dining_id) AS assigned_id,
            CASE 
                WHEN M.attraction_id IS NOT NULL THEN TRUE 
                ELSE FALSE 
            END AS isAttraction
        FROM theme_park.maintenance_logs AS M
        JOIN theme_park.employee AS E 
            ON (M.attraction_id = E.attraction OR M.dining_id = E.dining)
        WHERE M.currently_under_maintenance = TRUE 
        AND E.employee_id = ?;
    `;
    const [row] = await pool.execute(getActiveMaintenanceLog, [userID]);
    return row;
}

async function getActiveMaintenanceLog(req, res) {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', async () => {
    try {
        const { userID } = JSON.parse(body);
        console.log(userID);
        const activeMaintenanceLog = await getData(userID);
        console.log(activeMaintenanceLog);

        
        let returnedActiveMaintenanceLog;
        if(activeMaintenanceLog.length === 0) {
            returnedActiveMaintenanceLog = null;
        }
        else{
            returnedActiveMaintenanceLog = activeMaintenanceLog[0];
            returnedActiveMaintenanceLog.maintenance_date = new Date(returnedActiveMaintenanceLog.maintenance_date).toISOString().split('T')[0];
            returnedActiveMaintenanceLog.expected_completion_date = new Date(returnedActiveMaintenanceLog.expected_completion_date).toISOString().split('T')[0];
        }


        
        res.writeHead(200, { 'Content-Type': 'application/json' });

        res.end(JSON.stringify({
            success: true,
            data: returnedActiveMaintenanceLog
        }));
    } catch (error) {
        console.error('Error fetching active maintenance log:', error);


        res.writeHead(500, { 'Content-Type': 'application/json' });


        res.end(JSON.stringify({
            success: false,
            message: 'Failed to retrieve active maintenance log',
            error: error.message
        }));
    }
    })
}

module.exports = { getActiveMaintenanceLog }