async function testingPost(req, res){
    try{
        let body = ''
        req.on('data', (chunk) => {
            body += chunk.toString()
        })

        req.on('end', () => {
            const { name } = JSON.parse(body)
            const testThing = {
                name,
                message : "success creating testThing"
            }

            res.writeHead(200, {'Content-Type': 'application/json'})
            return res.end(JSON.stringify(testThing))
        })


        

    }
    catch(error){
        console.log(error)
    }
}

module.exports = {
    testingPost
}