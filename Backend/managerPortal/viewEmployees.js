const pool = require('../database');

async function pullData(){
    try{

        const sqlQuery = "SELECT E.first_name, E.last_name, E.role, A.attraction_name, E.phone_number, E.email,(SELECT S.email FROM employee AS S WHERE S.employee_id = E.supervisors_ID) AS supervisor_email FROM employee AS E, attraction_pos AS A WHERE E.attraction_pos = A.id;";

        const [rows] = await pool.execute(sqlQuery)
        return rows.length > 0 ? rows : [];
    }catch (err) {
        console.error("Database error:", err);
        throw err;
    }
}

async function viewEmployees(req, res){
    try {
        const employees = await pullData();
        
        if (!employees || employees.length === 0) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                message: "No employees found"
            }));
            return;
        }
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            data: employees,
            count: employees.length
        }));
    } catch (error) {
        console.error("Error in viewEmployees:", error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: false,
            message: "Internal server error",
            error: error.message
        }));
    }
}

module.exports = {
    viewEmployees
}