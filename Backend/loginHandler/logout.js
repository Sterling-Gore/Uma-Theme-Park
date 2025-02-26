const cookie = require('cookie');

function logout(req, res) {
    res.setHeader('Set-Cookie', cookie.serialize('token', '', {
        httpOnly: true,
        sameSite: 'Strict',
        expires: new Date(0), 
        path: '/'
    }));

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Logout successful' }));
}

module.exports = {
    logout
}
