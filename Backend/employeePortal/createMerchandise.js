const { v4: uuidv4 } = require('uuid');
const pool = require("../database");


async function createMerchandise(req, res) {
    try {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                console.log(body);
                const merchandise_id = uuidv4();  
                const {name, price, stock, image} = JSON.parse(body);
                const createMerchandiseQuery = "INSERT INTO theme_park.merchandise (merchandise_id, merchandise_name, merchandise_price, stock_amount, image_data) VALUES (?,?,?,?,?)";
                const [deleteMerchResponse] = await pool.execute(createMerchandiseQuery, [merchandise_id, name, price, stock, image]);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ success: true, message: "Success"}));
            } catch (error) {
                console.error("Error parsing request body:", error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({success: false,  message: "Invalid request data" }));
            }
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: false, message: "Internal Server Error" }));
    }
}

module.exports = {
    createMerchandise
};
