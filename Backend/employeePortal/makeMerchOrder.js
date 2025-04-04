const pool = require('../database');


async function runQuery(merchID){
    const query = "UPDATE theme_park.merchandise SET stock_amount = stock_amount + ? WHERE merchandise_id = ?;";
    try{
        const [rows] = await pool.execute(query, [10, merchID]);
        return rows.affectedRows > 0;
    } catch(err){
        throw err;
    }
}


async function makeMerchOrder(req, res){
    let body = "";
    try{
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', async () =>{
            const { merchandise_id } = JSON.parse(body);
            
            if(!merchandise_id){
                res.writeHead(400, {"Content-Type" : "application/json"});
                return res.end(JSON.stringify({
                    message: "No merchandise ID given"
                }));
            }

            const db_response = await runQuery(merchandise_id);

            if(!db_response){
                res.writeHead(400, {"Content-Type" : "application/json"});
                return res.end(JSON.stringify({
                    message: "No merch found with that ID"
                }));
            }

            res.writeHead(200, {"Content-Type" : "application/json"});
            return res.end(JSON.stringify({
                message: "Success"
            }));

        });
    } catch(err){
        console.log(err);
        res.writeHead(500, {"Content-Type" : "application/json"});
        return res.end(JSON.stringify({
            message: "Internal server error"
        }));
    }
}

module.exports = { makeMerchOrder };