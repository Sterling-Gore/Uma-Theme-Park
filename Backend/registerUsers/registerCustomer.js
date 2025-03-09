const { v4: uuidv4 } = require('uuid');
const pool = require("../database");
const bcrypt = require('bcrypt');

async function registerCustomer(req, res) {
    try {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const { first_name, last_name, birthday, email, phone_number, password, street, city, state, zip } = JSON.parse(body);
                const customer_id = uuidv4(); 
                const newPassword = await bcrypt.hash(password, 10);
                const [result] = await pool.execute(

                    "INSERT INTO theme_park.customers (customer_id, first_name, last_name, date_of_birth, email, password, phone_number, street_address, city, state, zipcode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [customer_id, first_name, last_name, birthday, email, newPassword, phone_number, street, city, state, zip]

                );

                console.log(result);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: "Success", customer_id }));
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
    registerCustomer
};
