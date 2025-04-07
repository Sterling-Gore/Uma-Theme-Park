const pool = require('../database');

async function pullData(){
    try{
        const sqlQuery = `SELECT 
    E.first_name, 
    E.last_name, 
    E.role, 
    E.employee_id,
    COALESCE(A.attraction_name, NULL) AS attraction_name, 
    COALESCE(D.dining_name, NULL) AS dining_name, 
    E.phone_number, 
    E.email
    FROM theme_park.employee AS E
    LEFT JOIN theme_park.attractions AS A ON E.attraction = A.attraction_id
    LEFT JOIN theme_park.dining AS D ON E.dining = D.dining_id;`;
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