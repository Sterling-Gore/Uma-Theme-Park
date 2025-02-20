const jwt = require('jsonwebtoken');

const SECRET_KEY = "1234";

function verifyToken(token) {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (err) {
        return null;
    }
}

async function checkAuth(req, res){
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'No token provided' }));
    }

    const token = authHeader.split(' ')[1];
    const user = verifyToken(token);

    if (user) {
        req.user = user; // here we can specify the user later
        return true;
    } else {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Invalid token' }));
        return false;
    }
}

module.exports = {
    checkAuth
};