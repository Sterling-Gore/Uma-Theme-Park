const jwt = require('jsonwebtoken');

const SECRET_KEY = "1234"

function authenticateUser(username, password){
    //this is where we connect to the database and check to see if the user exists 
    return username == 'user' && password == 'password';
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
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ token }));
        } else {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Invalid credentials' }));
        }
    })


}

module.exports = {
    login
}