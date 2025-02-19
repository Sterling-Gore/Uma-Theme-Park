//server.js 
const http = require('http')
const { testing } = require('./testing')
const { testingPost } = require('./testingPost')

const server = http.createServer((req, res) => {
    if(req.url === '/api/testing' && req.method === 'GET') {
        testing(req, res)
    }
    else if(req.url === '/api/testingPost' && req.method === 'POST'){
        testingPost(req, res)
    }
    else{
        res.writeHead(404, {'Content-Type': 'application/json'})
        res.end(JSON.stringify({ message: 'Route not found'}))
    }








    
})

const PORT = process.env.PORT || 3000

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))