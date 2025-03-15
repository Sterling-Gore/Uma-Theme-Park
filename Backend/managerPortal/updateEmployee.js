const pool = require("../database");
const bcrypt = require('bcrypt');

async function updateEmployee(req, res) {
    try {
        let body = '';

        req.on('data', (chunk => {
            body += chunk.toString();
        }));

        req.on('end', async () => {
            try {
                const { 
                    email, 
                    first_name, 
                    last_name, 
                    role, 
                    attraction, // Changed from attraction_pos to attraction
                    phone_number, 
                    password, 
                    supervisor_email 
                } = JSON.parse(body);
                
                // Validate required fields - email must be provided
                if (!email) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ message: "Email is required" }));
                }

                // Check if the employee exists with the provided email
                const [employee] = await pool.execute(
                    "SELECT * FROM theme_park.employee WHERE email = ?",
                    [email]
                );

                if (employee.length === 0) {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ message: "Employee not found" }));
                }

                // Get supervisor ID if supervisor email is provided
                let supervisorId = null;
                if (supervisor_email) {
                    const [supervisors] = await pool.execute(
                        "SELECT employee_id FROM theme_park.employee WHERE email = ?",
                        [supervisor_email]
                    );
                    
                    if (supervisors.length > 0) {
                        supervisorId = supervisors[0].employee_id;
                    } else {
                        // Handle case when supervisor email doesn't match any employee
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ 
                            message: "Supervisor email not found in the system" 
                        }));
                    }
                }

                // Validate attraction exists if provided
                if (attraction) {
                    const [attractionExists] = await pool.execute(
                        "SELECT attraction_id FROM theme_park.attractions WHERE attraction_id = ?",
                        [attraction]
                    );
                    
                    if (attractionExists.length === 0) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ 
                            message: "Specified attraction does not exist" 
                        }));
                    }
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

                if (attraction) {
                    // Now uses the direct attraction ID as a foreign key
                    updates.push("attraction = ?");
                    updateParams.push(attraction);
                }

                if (phone_number) {
                    updates.push("phone_number = ?");
                    updateParams.push(phone_number);
                }

                // Only update password if provided
                if (password) {
                    const newPassword = await bcrypt.hash(password, 10);
                    updates.push("password = ?");
                    updateParams.push(newPassword);
                }

                // Handle supervisor_ID (based on supervisor_email)
                if (supervisor_email !== undefined) {
                    updates.push("supervisors_id = ?");
                    updateParams.push(supervisorId);
                }

                // If no updates provided
                if (updates.length === 0) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ message: "No update data provided" }));
                }

                // Complete the query - update where email matches
                updateQuery += updates.join(", ") + " WHERE email = ?";
                updateParams.push(email);

                // Execute the update query
                const [result] = await pool.execute(updateQuery, updateParams);

                console.log("Update result:", result);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ 
                    message: "Success", 
                    affected_rows: result.affectedRows,
                    updated_email: email,
                    supervisor_id: supervisorId
                }));
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