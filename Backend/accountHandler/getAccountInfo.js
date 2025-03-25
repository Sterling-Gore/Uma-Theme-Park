const pool = require('../database');
const bcrypt = require('bcrypt')

async function getUser(userID){
    try{
        const sqlQuery = "SELECT first_name, last_name, date_of_birth, email, phone_number, street_address, city, state, zipcode FROM theme_park.customers WHERE customer_id = ?";
        const [rows] = await pool.execute(sqlQuery, [userID]);
        return rows.length > 0 ? rows[0] : null;
    } catch (err){
        console.error("Database error:", err);
        throw err;
    }
}


async function getAccountInfo(req, res){
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', async () => {
        try{
            const { userID } = JSON.parse(body);
            const customer = await getUser(userID);
            if(!customer){
                res.writeHead(401,  {'Content-Type' : 'application/json'});
                return res.end(JSON.stringify({message: 'No customer found'}));
            }
            res.writeHead(200, {'Content-Type' : 'application/json'});
            res.end(JSON.stringify(customer));
        }catch (err) {
            console.error("Error processing login:", err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "Internal server error" }));
        }
    })
}


module.exports = {
    getAccountInfo
}