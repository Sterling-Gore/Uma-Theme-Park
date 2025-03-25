const { v4: uuidv4 } = require('uuid');
const pool = require("../database");


async function createAttraction(req, res) {
    try {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                console.log(body);
                const attraction_id = uuidv4();  
                const {name, capacity, duration, description, image, status} = JSON.parse(body);
                const createAttractionQuery = "INSERT INTO theme_park.attractions (attraction_id, attraction_name, description, attraction_capacity, attraction_duration, attraction_status, image_data) VALUES (?,?,?,?,?,?,?)";
                const [deleteMerchResponse] = await pool.execute(createAttractionQuery, [attraction_id, name, description, capacity, duration, status, image]);

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
    createAttraction
};
