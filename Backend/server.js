// server.js 
require('dotenv').config();

const http = require('http');
const { testing } = require('./testing');
const { testingPost } = require('./testingPost');
const { registerCustomer } = require('./registerCustomer');
const { login } = require('./loginHandler/login')
const { checkAuth } = require('./loginHandler/auth')
const { logout } = require('./loginHandler/logout')
const pool = require('./database');

const PORT = process.env.PORT || 7000;

const server = http.createServer(async (req, res) => {
    // Set CORS Headers
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    //res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true')

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // DEFINE ROUTES HERE 
    if (req.url === '/api/testing' && req.method === 'GET') { 
        testing(req, res);
    }
    else if (req.url === '/api/testingPost' && req.method === 'POST'){
        testingPost(req, res);
    }
    else if (req.url === '/customer/createCustomer' && req.method === 'POST'){
        registerCustomer(req, res);
    }
    else if (req.url === '/login' && req.method === 'POST'){
        login(req, res)
    }
    else if (req.url === '/protected' && req.method === 'GET') {
        const isAuthenticated = await checkAuth(req, res);
        if (isAuthenticated) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: `Hello, ${req.user.username}` }));
        }
    }
    else if (req.url === '/logout' && req.method === 'GET'){
        logout(req, res)
    }
    else if( req.url === '/testDatabaseConnection' && req.method === 'GET'){
        pool.getConnection((err, connection) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: "Database connection failed", error: err.message }));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: "Successfully connected to the database" }));
                connection.release();
            }
        })
    }
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Route not found' }));
    }
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
