const pool = require("../database");


async function getStockQuery(merchandise_id) {
    try {

        const sqlQuery = "SELECT stock_amount FROM theme_park.merchandise WHERE merchandise_id = ?";
        const stock_amount = await pool.execute(sqlQuery, [merchandise_id]);
        console.log(merchandise_id)
        if(stock_amount[0].length > 0){
            console.log(stock_amount[0][0])
        }else{
            console.log("null")
        }
        //return stock_amount;
        return stock_amount[0].length > 0 ? stock_amount[0][0] : null;
    } catch (err) {
        console.error("Database error:", err);
        throw err;
    }
}


async function getMerchandiseStockQuantity(req, res) {
    try {


        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        });



        req.on('end', async () => {
            try {

                const { merchandise_id } = JSON.parse(body);
                const stock_quantity = await getStockQuery(merchandise_id);

                if (!stock_quantity) {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: "fetching merchandise stock quantity failed: merchandise_id not found" }));
                    return;
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({
                    success: true,
                    data: stock_quantity,
                    message: "Success"
                }));

            } catch (error) {
                console.error("Error parsing request body:", error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: "Invalid request data" }));
            }
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: "Internal Server Error" }));
    }
}

module.exports = {
    getMerchandiseStockQuantity
};
