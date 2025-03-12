const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const pool = require('../database');
const bcrypt = require('bcrypt')


async function authenticateUser (inputPassword, storedPassword) {
    return await bcrypt.compare(inputPassword, storedPassword);
}

function createToken(username) {
    return jwt.sign({ username }, process.env.SECRET_KEY || SECRET_KEY, { expiresIn: '1h' });
}

async function getCustomerByEmail(email) {
    try {

        const sqlQuery = "SELECT * FROM theme_park.customers WHERE email = ?";
        const [rows] = await pool.execute(sqlQuery, [email]);
        return rows.length > 0 ? rows[0] : null;
    } catch (err) {
        console.error("Database error:", err);
        throw err;
    }
}

async function login(req, res) {
    let body = '';

    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            const { username, password } = JSON.parse(body);
            const customer = await getCustomerByEmail(username);

            if (!customer) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: "Login failed: Email not found" }));
                return;
            }
            if (! await authenticateUser(password, customer.password)) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: "Login failed: Incorrect password" }));
                return;
            }

            const token = createToken(username);

            res.writeHead(200, {
                'Content-Type': 'application/json',
                'Set-Cookie': cookie.serialize('token', token, {
                    httpOnly: true,
                    secure: false, 
                    sameSite: 'Strict',
                    maxAge: 3600, 
                    path: '/'
                })
            });

            const customerFullName = `${customer.first_name} ${customer.last_name}` 
            res.end(JSON.stringify({ user: "Customer", id: customer.customer_id, fullName: customerFullName}));
 
        } catch (err) {
            console.error("Error processing login:", err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "Internal server error" }));
        }
    });
}

module.exports = {
    login
};
