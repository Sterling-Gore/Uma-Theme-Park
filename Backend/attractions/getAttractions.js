const pool = require('../database')

async function getData() {
    const sqlQuery = 'SELECT * FROM theme_park.attractions;'
    const [rows] = await pool.execute(sqlQuery);
    return rows;
}

async function getAttractions(req, res) {
    try {
        const attractions = await getData();

        res.writeHead(200, { 'Content-Type': 'application/json' });

        res.end(JSON.stringify({
            success: true,
            data: attractions
        }));
    } catch (error) {
        console.error('Error fetching attractions:', error);


        res.writeHead(500, { 'Content-Type': 'application/json' });


        res.end(JSON.stringify({
            success: false,
            message: 'Failed to retrieve attractions',
            error: error.message
        }));
    }
}

module.exports = { getAttractions }