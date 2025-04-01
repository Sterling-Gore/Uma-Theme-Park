const pool = require('../database')

async function getData(userID) {
    const getActiveMaintenanceLog = 'SELECT M.log_id, M.maintenance_name, M.maintenance_description, M.maintenance_cost, M.maintenance_date, M.expected_completion_date  FROM theme_park.maintenance_logs as M, theme_park.employee as E WHERE M.attraction_id = E.attraction AND M.currently_under_maintenance = true AND E.employee_id = ?;'
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