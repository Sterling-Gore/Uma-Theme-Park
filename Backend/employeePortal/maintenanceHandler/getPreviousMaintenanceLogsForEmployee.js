const pool = require('../../database')

async function getData(userID) {
    const getPreviousMaintenanceLogs = `
        SELECT 
            M.log_id, 
            M.maintenance_name, 
            M.maintenance_description, 
            M.maintenance_cost, 
            M.maintenance_date, 
            M.expected_completion_date, 
            M.finalized_date,
            COALESCE(M.attraction_id, M.dining_id) AS assigned_id,
            CASE 
                WHEN M.attraction_id IS NOT NULL THEN TRUE 
                ELSE FALSE 
            END AS isAttraction
        FROM theme_park.maintenance_logs AS M
        JOIN theme_park.employee AS E 
            ON (M.attraction_id = E.attraction OR M.dining_id = E.dining)
        WHERE M.currently_under_maintenance = FALSE 
        AND E.employee_id = ?;
    `;
    const [row] = await pool.execute(getPreviousMaintenanceLogs, [userID]);
    return row;
}

async function getPreviousMaintenanceLogsForEmployee(req, res) {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', async () => {
    try {
        const { userID } = JSON.parse(body);
        const previousMaintenanceLogs = await getData(userID);

        
        let returnedActiveMaintenanceLogs;
        if(previousMaintenanceLogs.length === 0) {
            returnedActiveMaintenanceLogs = null;
        }
        else{
            returnedActiveMaintenanceLogs = previousMaintenanceLogs.map((Maintenance_log) => {
                Maintenance_log.maintenance_date = new Date(Maintenance_log.maintenance_date).toISOString().split('T')[0];
                Maintenance_log.expected_completion_date = new Date(Maintenance_log.expected_completion_date).toISOString().split('T')[0];
                Maintenance_log.finalized_date = new Date(Maintenance_log.finalized_date).toISOString().split('T')[0];
                return Maintenance_log;
        });
        }


        
        res.writeHead(200, { 'Content-Type': 'application/json' });

        res.end(JSON.stringify({
            success: true,
            data: returnedActiveMaintenanceLogs
        }));
    } catch (error) {
        console.error('Error fetching previous maintenance logs:', error);


        res.writeHead(500, { 'Content-Type': 'application/json' });


        res.end(JSON.stringify({
            success: false,
            message: 'Failed to retrieve previous maintenance logs',
            error: error.message
        }));
    }
    })
}

module.exports = { getPreviousMaintenanceLogsForEmployee }