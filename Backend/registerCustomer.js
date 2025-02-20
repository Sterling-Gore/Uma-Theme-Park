async function registerCustomer(req, res){
    try{
        let body = ''

        req.on('data', (chunk) => {
            body += chunk.toString()
        })

        req.on('end', () => {
            const { first_name, last_name, birthday, email, phone_number, passowrd, confirm_password, street, city, state, zip } = JSON.parse(body)
            const testThing = {
                first_name,
                last_name,
                birthday,
                email,
                phone_number,
                passowrd,
                confirm_password,
                street,
                city,
                state,
                zip
            }

            res.writeHead(200, {'Content-Type': 'application/json'})
            return res.end(JSON.stringify({message : "Success"}))
        })

    }
    catch(error){
        console.log(error)
    }


}


module.exports = {
    registerCustomer
}