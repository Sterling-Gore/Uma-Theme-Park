const pool = require("../database");

async function deleteEmployee (req, res) {
    try {
        let body = '';

        req.on('data', (chunk => {
            body += chunk.toString();
        }));

        req.on('end', async () => {
            try {
                const { employee_id, email } = JSON.parse(body);

                // Validate that at least one identifier is provided
                if (!employee_id && !email) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ message: "Either Employee ID or Email is required" }));
                }

                // Build the query based on which identifier is provided
                let query = "SELECT * FROM theme_park.employee WHERE ";
                let params = [];

                if (email) {
                    query += "email = ?";
                    params.push(email);
                } else {
                    query += "employee_id = ?";
                    params.push(employee_id);
                }

                // First, check if the employee exists
                const [employee] = await pool.execute(query, params);

                if (employee.length === 0) {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ message: "Employee not found" }));
                }

                // Get the employee_id from the result for deletion
                const employeeIdToDelete = employee[0].employee_id;

                // Delete the employee
                const [result] = await pool.execute(
                    "DELETE FROM theme_park.employee WHERE employee_id = ?",
                    [employeeIdToDelete]
                );

                console.log("Delete result:", result);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ 
                    message: "Success", 
                    affected_rows: result.affectedRows,
                    deleted_email: employee[0].email 
                }));
            } catch (error) {
                console.error("Error deleting employee:", error);
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
    deleteEmployee
}