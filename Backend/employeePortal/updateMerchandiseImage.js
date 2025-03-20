const pool = require("../database");


async function updateMerchandiseImage(req, res) {
    try {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const {id, newImage} = JSON.parse(body);
                
                const updateMerchandiseImageQuery = "UPDATE theme_park.merchandise SET image_data = ? WHERE merchandise_id = ?";
                const [merchImageUpdateResult] = await pool.execute(updateMerchandiseImageQuery, [newImage, id]);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: "Success"}));
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
    updateMerchandiseImage
};
