const jwt = require('jsonwebtoken');
const cookie = require('cookie')

const SECRET_KEY = "1234"

function authenticateUser(username, password){
    //this is where we connect to the database and check to see if the user exists 
    return username == 'username@gmail.com' && password == 'password';
}

function createToken(username) {
    return jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
}


async function login(req, res){
    let body = ''

    req.on('data', (chunk) => {
        body += chunk.toString()
    })

    req.on('end', () => {
        const { username, password } = JSON.parse(body);
        if (authenticateUser(username, password)) {
            const token = createToken(username);

            res.writeHead(200, {
                'Content-Type': 'application/json',
                'Set-Cookie': cookie.serialize('token', token, {
                    httpOnly: true,
                    secure: false,  // I'm making this false for now for Http and local development 
                    sameSite: 'Strict',
                    maxAge: 3600, // this is 1 hour 
                    path: '/'
                })
            });

            res.end(JSON.stringify({ message: 'Login successful' }));
        } else {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "Failed to login" }));
        }
    })


}

module.exports = {
    login
}