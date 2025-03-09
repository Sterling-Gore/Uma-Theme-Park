const pool = require("../database");

async function deleteEmployee (req, res) {
    try {
        let body = '';

        req.on('data', (chunk => {
            body += chunk.toString();
        }));

        req.on('end', async () => {
            try {
                const { employee_id } = JSON.parse(body);

                // Validate employee_id
                if (!employee_id) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ message: "Employee ID is required" }));
                }

                // First, check if the employee exists
                const [employee] = await pool.execute(
                    "SELECT * FROM theme_park.employee WHERE employee_id = ?",
                    [employee_id]
                );

                if (employee.length === 0) {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ message: "Employee not found" }));
                }

                // Delete the employee
                const [result] = await pool.execute(
                    "DELETE FROM theme_park.employee WHERE employee_id = ?",
                    [employee_id]
                );

                console.log("Delete result:", result);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: "Success", affected_rows: result.affectedRows }));
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