const pool = require("../database");
const bcrypt = require('bcrypt');

async function updateEmployee (req, res) {
    try {
        let body = '';

        req.on('data', (chunk => {
            body += chunk.toString();
        }));

        req.on('end', async () => {
            try {
                const { 
                    employee_id, 
                    first_name, 
                    last_name, 
                    role, 
                    attraction_pos, 
                    phone_number, 
                    email, 
                    password, 
                    supervisor_ID 
                } = JSON.parse(body);

                // Validate required fields
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

                // Build SQL update query parts
                let updateQuery = "UPDATE theme_park.employee SET ";
                const updateParams = [];
                const updates = [];

                if (first_name) {
                    updates.push("first_name = ?");
                    updateParams.push(first_name);
                }

                if (last_name) {
                    updates.push("last_name = ?");
                    updateParams.push(last_name);
                }

                if (role) {
                    updates.push("role = ?");
                    updateParams.push(role);
                }

                if (attraction_pos) {
                    updates.push("attraction_pos = ?");
                    updateParams.push(attraction_pos);
                }

                if (phone_number) {
                    updates.push("phone_number = ?");
                    updateParams.push(phone_number);
                }

                if (email) {
                    updates.push("email = ?");
                    updateParams.push(email);
                }

                // Only update password if provided
                if (password) {
                    const newPassword = await bcrypt.hash(password, 10);
                    updates.push("password = ?");
                    updateParams.push(newPassword);
                }

                // Handle supervisor_ID (can be null)
                if (supervisor_ID !== undefined) {
                    updates.push("supervisors_id = ?");
                    updateParams.push(supervisor_ID || null);
                }

                // If no updates provided
                if (updates.length === 0) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ message: "No update data provided" }));
                }

                // Complete the query
                updateQuery += updates.join(", ") + " WHERE employee_id = ?";
                updateParams.push(employee_id);

                // Execute the update query
                const [result] = await pool.execute(updateQuery, updateParams);

                console.log("Update result:", result);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: "Success", affected_rows: result.affectedRows }));
            } catch (error) {
                console.error("Error updating employee:", error);
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
    updateEmployee
}