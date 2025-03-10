const { v4: uuidv4 } = require('uuid');
const pool = require("../database");
const bcrypt = require('bcrypt');

async function registerEmployee (req, res) {
    try{
        let body = '';

        req.on('data', (chunk => {
            body += chunk.toString();
        }))

        req.on('end', async () =>{
            try {
                let { first_name, last_name, role, attraction_pos, phone_number, email, password, supervisor_ID = null, supervisor_email = null } = JSON.parse(body);
                const employee_id = uuidv4(); 
                const newPassword = await bcrypt.hash(password, 10);
                
                // Handle attraction_pos conversion
                if (attraction_pos === "attration1") {
                    attraction_pos = 1;
                }
                
                // If supervisor_email is provided, look up the supervisor's ID
                if (supervisor_email && !supervisor_ID) {
                    try {
                        const [supervisors] = await pool.execute(
                            "SELECT employee_id FROM theme_park.employee WHERE email = ?",
                            [supervisor_email]
                        );
                        
                        if (supervisors.length > 0) {
                            supervisor_ID = supervisors[0].employee_id;
                        }
                    } catch (err) {
                        console.error("Error finding supervisor:", err);
                        // Continue even if supervisor not found
                    }
                }
                
                console.log("Creating employee with role:", role);
                console.log("Attraction position:", attraction_pos);
                
                const [result] = await pool.execute(
                    "INSERT INTO theme_park.employee (employee_id, first_name, last_name, role, attraction_pos, phone_number, email, password, supervisors_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [employee_id, first_name, last_name, role, attraction_pos, phone_number, email, newPassword, supervisor_ID]
                );

                console.log(result);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: "Success", employee_id }));
            } catch (error) {
                console.error("Error parsing request body:", error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: "Invalid request data" }));
            }
        })

    } catch(error){
        console.error("Unexpected error:", error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: "Internal Server Error" }));
    }
}

module.exports = {
    registerEmployee
}