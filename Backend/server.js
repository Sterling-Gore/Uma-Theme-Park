// server.js 
require('dotenv').config();

const http = require('http');
const { testing } = require('./testing');
const { testingPost } = require('./testingPost');
const { registerCustomer } = require('./registerUsers/registerCustomer');
const { login } = require('./loginHandler/login')
const { checkAuth } = require('./loginHandler/auth')
const { logout } = require('./loginHandler/logout')
const { registerEmployee } = require('./registerUsers/registerEmployee')
const { employeeLogin } = require('./employeeHandler/employeeLogin')
const pool = require('./database');
//Mercandise
const { getMerchandise } = require('./shoppingCart/getMerchandise');
const { deleteMerchandise } = require('./employeePortal/deleteMerchandise');
const { createMerchandise } = require('./employeePortal/createMerchandise');
const { updateMerchandiseStock } = require('./employeePortal/updateMerchandiseStock');
const { updateMerchandisePrice } = require('./employeePortal/updateMerchandisePrice');
const { updateMerchandiseImage } = require('./employeePortal/updateMerchandiseImage');
const { createAttraction } = require('./employeePortal/createAttraction');
const { updateAttractionImage } = require('./employeePortal/updateAttractionImage');
const { updateAttractionStatus } = require('./employeePortal/updateAttractionStatus');
const { updateAttractionDescription } = require('./employeePortal/updateAttractionDescription');
const { updateAttractionCapacity } = require('./employeePortal/updateAttractionCapacity');
const { updateAttractionDuration } = require('./employeePortal/updateAttractionDuration');
const { deleteAttraction } = require('./employeePortal/deleteAttraction');
const { getMerchandiseStockQuantity } = require('./shoppingCart/getMerchandiseStockQuantity');
const { purchaseTicketsAndMerch } = require('./shoppingCart/purchaseTicketsAndMerch');
const { viewEmployees } = require('./managerPortal/viewEmployees');
const { deleteEmployee } = require('./managerPortal/deleteEmployee');
const { updateEmployeeAttraction } = require('./managerPortal/updateEmployeeAttraction');
const { submitFeedback } = require('./feedback/submitFeedback');
const { getAccountInfo } = require('./accountHandler/getAccountInfo');
const { UpdatePassword } = require('./accountHandler/updatePassword');
const { UpdateAccount } = require('./accountHandler/UpdateAccount');
const { getTicketOrders } = require('./myorders/getTicketOrders');
const { getMerchandiseOrders } = require('./myorders/getMerchandiseOrders');
const { getAttractions } = require('./attractions/getAttractions');
const { getAttractionName } = require('./attractions/getAttractionName');
const { getFeedback } = require('./employeePortal/getFeedback');
const { getTasks } = require('./employeePortal/getTasks')
const { updateTaskStatus } = require('./employeePortal/updateTaskStatus')

const PORT = process.env.PORT || 7000;

const allowedOrigins = ['http://localhost:3000', 'https://bluehorizonadventures.vercel.app'];

const server = http.createServer(async (req, res) => {
    // Set CORS Headers

    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    //res.setHeader('Access-Control-Allow-Origin', allowedOrigins);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    //res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true')

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

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
    else if (req.url === '/createEmployee' && req.method === 'POST'){
        registerEmployee(req, res)
    }
    else if(req.url === '/employeeLogin' && req.method === 'POST'){
        employeeLogin(req, res)
    }
    else if(req.url === '/viewEmployees' && req.method === 'GET'){
        viewEmployees(req, res)
    }
    else if(req.url === '/deleteEmployee' && req.method === 'DELETE'){
        deleteEmployee(req, res)
    }
    else if(req.url === '/updateEmployeeAttraction' && req.method === 'PUT'){
        updateEmployeeAttraction(req, res)
    }
    else if(req.url === '/getMerchandise' && req.method === 'GET'){
        getMerchandise(req, res)
    }
    else if(req.url === '/deleteMerchandise' && req.method === 'POST'){
        deleteMerchandise(req, res)
    }
    else if(req.url === '/createMerchandise' && req.method === 'POST'){
        createMerchandise(req, res)
    }
    else if(req.url === '/updateMerchandiseStock' && req.method === 'POST'){
        updateMerchandiseStock(req, res)
    }
    else if(req.url === '/updateMerchandisePrice' && req.method === 'POST'){
        updateMerchandisePrice(req, res)
    }
    else if(req.url === '/updateMerchandiseImage' && req.method === 'POST'){
        updateMerchandiseImage(req, res)
    }
    else if(req.url === '/createAttraction' && req.method === 'POST'){
        createAttraction(req, res)
    }
    else if(req.url === '/updateAttractionStatus' && req.method === 'POST'){
        updateAttractionStatus(req, res)
    }
    else if(req.url === '/updateAttractionImage' && req.method === 'POST'){
        updateAttractionImage(req, res)
    }
    else if(req.url === '/updateAttractionDescription' && req.method === 'POST'){
        updateAttractionDescription(req, res)
    }
    else if(req.url === '/updateAttractionDuration' && req.method === 'POST'){
        updateAttractionDuration(req, res)
    }
    else if(req.url === '/updateAttractionCapacity' && req.method === 'POST'){
        updateAttractionCapacity(req, res)
    }
    else if(req.url === '/deleteAttraction' && req.method === 'POST'){
        deleteAttraction(req, res)
    }
    else if(req.url === '/getMerchandiseStockQuantity' && req.method === 'POST'){
        getMerchandiseStockQuantity(req, res)
    }
    else if(req.url === '/purchaseTicketsAndMerch' && req.method === 'POST'){
        purchaseTicketsAndMerch(req, res)
    }
    else if (req.url === '/submitFeedback' && req.method === 'POST'){
        submitFeedback(req, res)
    }
    else if (req. url === '/getAccountInfo' && req.method === 'POST'){
        getAccountInfo(req, res)
    }
    else if(req.url === '/updatePassword' && req.method === 'PUT'){
        UpdatePassword(req, res)
    }
    else if(req.url === '/updateAccountInfo' && req.method === 'PUT'){
        UpdateAccount(req, res)
    }
    else if(req.url === '/getTicketOrders' && req.method === 'POST'){
        getTicketOrders(req, res)
    }
    else if(req.url === '/getMerchandiseOrders' && req.method === 'POST'){
        getMerchandiseOrders(req, res)
    }
    else if(req.url === '/getAttractions' && req.method === 'GET'){
        getAttractions(req, res)
    }
    else if(req.url === '/getFeedback' && req.method === 'GET'){
        getFeedback(req, res)
    }
    else if(req.url === '/getAttractionName' && req.method === 'GET'){
        getAttractionName(req, res)
    }
    else if(req.url === '/getTasks' && req.method === 'GET'){
        getTasks(req, res)
    }
    else if(req.url === '/updateTaskStatus' && req.method === 'PUT'){
        updateTaskStatus(req, res)
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
