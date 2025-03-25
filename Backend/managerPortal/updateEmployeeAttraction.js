const pool = require("../database");

async function updateEmployeeAttraction(req, res) {
    try {
        let body = '';

        req.on('data', (chunk => {
            body += chunk.toString();
        }));

        req.on('end', async () => {
            try {
                const { email, attraction } = JSON.parse(body);
                
                // Validate required fields
                if (!email || !attraction) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ 
                        message: "Both email and attraction are required" 
                    }));
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

                // Validate attraction exists
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

                // Update ONLY the attraction field
                const updateQuery = "UPDATE theme_park.employee SET attraction = ? WHERE email = ?";
                const [result] = await pool.execute(updateQuery, [attraction, email]);

                console.log("Update result:", result);
                
                if (result.affectedRows > 0) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ 
                        message: "Success", 
                        affected_rows: result.affectedRows,
                        updated_email: email
                    }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ message: "No records were updated" }));
                }
            } catch (error) {
                console.error("Error updating employee attraction:", error);
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
    updateEmployeeAttraction
}