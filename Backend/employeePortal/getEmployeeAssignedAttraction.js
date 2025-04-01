const pool = require('../database')

async function getData(userID) {
    const getEmployeeAttractionQuery = 'SELECT A.attraction_id, A.attraction_name, A.image_data, A.attraction_status FROM theme_park.attractions as A, theme_park.employee as E WHERE A.attraction_id = E.attraction AND E.employee_id = ?;'
    const [row] = await pool.execute(getEmployeeAttractionQuery, [userID]);
    return row;
}

async function getEmployeeAssignedAttraction(req, res) {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', async () => {
    try {
        const { userID } = JSON.parse(body);
        const attraction = await getData(userID);
        console.log(attraction);

        const { default: imageType } = await import('image-type');

        async function processAttraction(_attraction) {
            const base64Data = _attraction[0].image_data.toString('utf-8');
            const bufferData = Buffer.from(base64Data, 'base64');
            const detectedType = await imageType(bufferData);
            const mimeType = detectedType ? detectedType.mime : 'application/octet-stream';
            const viewing_image = bufferData.toString('base64');
            
            return {
                ..._attraction[0],
                mimeType,
                viewing_image
            };
        }

        let returnedAttraction;
        if(attraction.length === 0) {
            returnedAttraction = null;
        }
        else{
            returnedAttraction = await processAttraction(attraction);
        }

        
        res.writeHead(200, { 'Content-Type': 'application/json' });

        res.end(JSON.stringify({
            success: true,
            data: returnedAttraction
        }));
    } catch (error) {
        console.error('Error fetching attraction:', error);


        res.writeHead(500, { 'Content-Type': 'application/json' });


        res.end(JSON.stringify({
            success: false,
            message: 'Failed to retrieve attraction',
            error: error.message
        }));
    }
    })
}

module.exports = { getEmployeeAssignedAttraction }