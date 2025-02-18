async function testing(req, res) {
    try{
        res.writeHead(200, {'Content-Type' : 'application/json'})
        res.end(JSON.stringify({testingMessage : 'success'}))
    } catch(error){
        console.log(error)
    }
}

module.exports = {
    testing
}