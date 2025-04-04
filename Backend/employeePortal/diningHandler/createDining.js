const { v4: uuidv4 } = require('uuid');
const pool = require("../../database");


async function createDining(req, res) {
    try {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                console.log(body);
                const dining_id = uuidv4();  
                const {name, description, image, status} = JSON.parse(body);
                const createDiningQuery = "INSERT INTO theme_park.dining (dining_id, dining_name, dining_description, dining_status, image_data) VALUES (?,?,?,?,?)";
                const [createDiningResponse] = await pool.execute(createDiningQuery, [dining_id, name, description, status, image]);

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
    createDining
};
