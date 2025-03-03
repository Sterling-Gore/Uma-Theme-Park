const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const pool = require('../database');
const bcrypt = require('bcrypt')

async function authenticateUser (inputPassword, storedPassword) {
    const decryptedPass = await bcrypt.compare(inputPassword, storedPassword);
    return inputPassword === storedPassword;
}

function createToken(username) {
    return jwt.sign({ username }, process.env.SECRET_KEY, { expiresIn: '1h' });
}

async function getCustomerByEmail(email) {
    try {
        const sqlQuery = "SELECT * FROM theme_park.employee WHERE email = ?";
        const [rows] = await pool.execute(sqlQuery, [email]);
        return rows.length > 0 ? rows[0] : null;
    } catch (err) {
        console.error("Database error:", err);
        throw err;
    }
}

async function employeeLogin(req, res) {
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

            if (!authenticateUser(password, customer.password)) {
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

            res.end(JSON.stringify({ user: "Employee" }));

        } catch (err) {
            console.error("Error processing login:", err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "Internal server error" }));
        }
    });
}

module.exports = {
    employeeLogin
};
