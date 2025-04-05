const pool = require("../../database");


async function updateAttractionCapacity(req, res) {
    try {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const {id, newCapacity} = JSON.parse(body);
                
                const updateAttractionCapacityQuery= "UPDATE theme_park.attractions SET attraction_capacity = ? WHERE attraction_id = ?";
                const [attractionCapacityUpdateResult] = await pool.execute(updateAttractionCapacityQuery, [newCapacity, id]);

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
    updateAttractionCapacity
};
