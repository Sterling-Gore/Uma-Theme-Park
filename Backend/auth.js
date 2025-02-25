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
    const cookieHeader = req.headers.cookie;

    if (!cookieHeader) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'No token provided' }));
        return false;
    }

    const cookies = Object.fromEntries(cookieHeader.split('; ').map(c => c.split('=')));
    const token = cookies.token
    if (!token) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Authentication token not found in cookies' }));
        return false;
    }
    const user = verifyToken(token);

    if (!user) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Invalid token' }));
        return false;
    }

    req.user = user; // attaching the user to the req
    return true;

}

module.exports = {
    checkAuth
};