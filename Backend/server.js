// server.js 
const http = require('http');
const { testing } = require('./testing');
const { testingPost } = require('./testingPost');
const { registerCustomer } = require('./registerCustomer');
const { login } = require('./login')
const { checkAuth } = require('./auth')

const PORT = process.env.PORT || 4000;

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
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Route not found' }));
    }


    
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
