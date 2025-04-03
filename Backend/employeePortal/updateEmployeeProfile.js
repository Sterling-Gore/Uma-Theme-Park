const pool = require("../database");

async function updateEmployeeProfile(req, res) {
    try {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const { employee_id, first_name, last_name, email, password } = JSON.parse(body);
                
                const updateEmployeeQuery = "UPDATE employee SET first_name = ?, last_name = ?, email = ?, password = ? WHERE employee_id = ?";
                await pool.execute(updateEmployeeQuery, [first_name, last_name, email, password, employee_id]);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: "Employee profile updated successfully" }));
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
    updateEmployeeProfile
};
