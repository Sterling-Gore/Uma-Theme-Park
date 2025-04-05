const pool = require('../../database');


async function runQuery(employee_id){
    try{
        const query = "SELECT first_name, last_name, email, phone_number FROM theme_park.employee WHERE employee_id = ?;";
        const [rows] = await pool.execute(query, [employee_id]);
        console.log(rows);
        return rows.length > 0 ? rows[0] : null;
    } catch(err){
        throw err;
    }
}

async function getEmployeeInfo(req, res) {
    try{
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            const { employee_id } = JSON.parse(body);

            if(!employee_id){
                res.writeHead(400, {'Content-Type' : 'application/json'});
                return res.end(JSON.stringify({
                    message : "No employee id given"
                }));
            }

            const employee_info = await runQuery(employee_id);

            if (employee_info === null){
                res.writeHead(400,  {'Content-Type' : 'application/json'});
                return res.end(JSON.stringify({
                    message: "No employee found"
                }));
            }

            res.writeHead(200, {'Content-Type' : 'application/json'});
            return res.end(JSON.stringify({
                message : "Success",
                data : employee_info
            }));
        
        });
    } catch(err){
        console.log(err);
        res.writeHead(500,  {'Content-Type' : 'application/json'});
        return res.end(JSON.stringify({
            message: "Internal server error"
        }));
    }

};

module.exports = {
    getEmployeeInfo
}