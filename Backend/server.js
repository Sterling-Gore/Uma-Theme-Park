// server.js 
require('dotenv').config();

const http = require('http');
const url = require('url')
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
const { deleteMerchandise } = require('./employeePortal/merchandiseHandler/deleteMerchandise');
const { createMerchandise } = require('./employeePortal/merchandiseHandler/createMerchandise');
const { updateMerchandiseStock } = require('./employeePortal/merchandiseHandler/updateMerchandiseStock');
const { updateMerchandisePrice } = require('./employeePortal/merchandiseHandler/updateMerchandisePrice');
const { updateMerchandiseImage } = require('./employeePortal/merchandiseHandler/updateMerchandiseImage');
const { createAttraction } = require('./employeePortal/attractionHandler/createAttraction');
const { createDining } = require('./employeePortal/diningHandler/createDining');
const {updateDiningDescription} = require('./employeePortal/diningHandler/updateDiningDescription');
const {updateDiningStatus} = require('./employeePortal/diningHandler/updateDiningStatus');
const {updateDiningImage} = require('./employeePortal/diningHandler/updateDiningImage');
const { updateAttractionImage } = require('./employeePortal/attractionHandler/updateAttractionImage');
const { updateAttractionStatus } = require('./employeePortal/attractionHandler/updateAttractionStatus');
const { updateAttractionDescription } = require('./employeePortal/attractionHandler/updateAttractionDescription');
const { updateAttractionCapacity } = require('./employeePortal/attractionHandler/updateAttractionCapacity');
const { updateAttractionDuration } = require('./employeePortal/attractionHandler/updateAttractionDuration');
const { getEmployeeAssignment } = require('./employeePortal/employeeProfile/getEmployeeAssignment');
const { getPreviousMaintenanceLogsForEmployee } = require('./employeePortal/maintenanceHandler/getPreviousMaintenanceLogsForEmployee')
const { getActiveMaintenanceLog } = require('./employeePortal/maintenanceHandler/getActiveMaintenanceLog');
const { createMaintenanceLog } = require('./employeePortal/maintenanceHandler/createMaintenanceLog');
const { closeMaintenanceLog } = require('./employeePortal/maintenanceHandler/closeMaintenanceLog');
const { editMaintenanceLog } = require('./employeePortal/maintenanceHandler/editMaintenanceLog');
const { deleteAttraction } = require('./employeePortal/attractionHandler/deleteAttraction');
const { deleteDining } = require('./employeePortal/diningHandler/deleteDining');
const { getMerchandiseStockQuantity } = require('./shoppingCart/getMerchandiseStockQuantity');
const { purchaseTicketsAndMerch } = require('./shoppingCart/purchaseTicketsAndMerch');
const { viewEmployees } = require('./managerPortal/viewEmployees');
const { deleteEmployee } = require('./managerPortal/deleteEmployee');
const { updateEmployeeAttraction } = require('./managerPortal/updateEmployeeAttraction');
const { submitFeedback } = require('./feedback/submitFeedback');
const { getAccountInfo } = require('./accountHandler/getAccountInfo');
const { deleteAccount } = require('./accountHandler/deleteAccount');
const { UpdatePassword } = require('./accountHandler/updatePassword');
const { UpdateAccount } = require('./accountHandler/UpdateAccount');
const { getTicketOrders } = require('./myorders/getTicketOrders');
const { getMerchandiseOrders } = require('./myorders/getMerchandiseOrders');
const { getAttractions } = require('./attractions/getAttractions');
const { getDining } = require('./dining/getDining')
const { getAttractionName } = require('./attractions/getAttractionName');
const { getDiningName } = require('./dining/getDiningName');
const { getFeedback } = require('./employeePortal/getFeedback');
const { getTasks } = require('./employeePortal/getTasks')
const { updateTaskStatus } = require('./employeePortal/updateTaskStatus')
const { updateEmployeeProfile} = require('./employeePortal/employeeProfile/updateEmployeeProfile');
const { generateFinanceReport } = require('./managerPortal/reports/financeReport');
const { generateMaintenanceReport } = require('./managerPortal/reports/maintenanceReport');
const { getEmployeeInfo } = require('./employeePortal/employeeProfile/getEmployeeInfo');
const { updateEmployeePassword } = require('./employeePortal/employeeProfile/updateEmployeePassword');
const { makeMerchOrder } = require('./employeePortal/makeMerchOrder');

const {generateParkReport} = require('./employeePortal/generateParkReport')

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
    else if(req.url === '/createDining' && req.method === 'POST'){
        createDining(req, res)
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
    else if(req.url === '/updateDiningStatus' && req.method === 'POST'){
        updateDiningStatus(req, res)
    }
    else if(req.url === '/updateDiningImage' && req.method === 'POST'){
        updateDiningImage(req, res)
    }
    else if(req.url === '/updateDiningDescription' && req.method === 'POST'){
        updateDiningDescription(req, res)
    }
    else if(req.url === '/updateAttractionDuration' && req.method === 'POST'){
        updateAttractionDuration(req, res)
    }
    else if(req.url === '/getEmployeeAssignment' && req.method === 'POST'){
        getEmployeeAssignment(req, res)
    }
    else if(req.url === '/getPreviousMaintenanceLogsForEmployee' && req.method === 'POST'){
        getPreviousMaintenanceLogsForEmployee(req, res)
    }
    else if(req.url === '/getActiveMaintenanceLog' && req.method === 'POST'){
        getActiveMaintenanceLog(req, res)
    }
    else if(req.url === '/createMaintenanceLog' && req.method === 'POST'){
        createMaintenanceLog(req, res)
    }
    else if(req.url === '/closeMaintenanceLog' && req.method === 'POST'){
        closeMaintenanceLog(req, res)
    }
    else if(req.url === '/editMaintenanceLog' && req.method === 'POST'){
        editMaintenanceLog(req, res)
    }
    else if(req.url === '/updateAttractionCapacity' && req.method === 'POST'){
        updateAttractionCapacity(req, res)
    }
    else if(req.url === '/deleteAttraction' && req.method === 'POST'){
        deleteAttraction(req, res)
    }
    else if(req.url === '/deleteDining' && req.method === 'POST'){
        deleteDining(req, res)
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
    else if (req. url === '/deleteAccount' && req.method === 'POST'){
        deleteAccount(req, res)
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
    else if(req.url === '/getDining' && req.method === 'GET'){
        getDining(req, res)
    }
    else if(req.url === '/getFeedback' && req.method === 'GET'){
        getFeedback(req, res)
    }
    else if(req.url === '/updateEmployeeProfile' && req.method === 'PUT')
    {
        updateEmployeeProfile(req,res)
    }
    else if(req.url === '/getAttractionName' && req.method === 'GET'){
        getAttractionName(req, res)
    }
    else if(req.url === '/getDiningName' && req.method === 'GET'){
        getDiningName(req, res)
    }
    else if(req.url === '/getTasks' && req.method === 'GET'){
        getTasks(req, res)
    }
    else if(req.url === '/updateTaskStatus' && req.method === 'PUT'){
        updateTaskStatus(req, res)
    }
    else if(url.parse(req.url).pathname === '/financeReport' && req.method === 'GET') {
        generateFinanceReport(req, res)
    }
    
    else if(url.parse(req.url).pathname === '/maintenanceReport' && req.method === 'GET') {
        generateMaintenanceReport(req, res)
    }

    else if(url.parse(req.url).pathname === '/generateParkReport' && req.method === 'GET') {
        generateParkReport(req, res)
    }
    else if (req.url === '/getEmployeeInfo' && req.method === 'POST'){
        getEmployeeInfo(req, res)
    }
    else if(req.url === '/updateEmployeePassword' && req.method === 'PUT'){
        updateEmployeePassword(req, res);
    }
    else if(req.url === '/makeMerchOrder' && req.method === 'POST'){
        makeMerchOrder(req, res);
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
