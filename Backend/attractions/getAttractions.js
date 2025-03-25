const pool = require('../database')

async function getData() {
    const sqlQuery = 'SELECT * FROM theme_park.attractions;'
    const [rows] = await pool.execute(sqlQuery);
    return rows;
}

async function getAttractions(req, res) {
    try {
        const attractions = await getData();

        // Dynamically import `image-type`
        const { default: imageType } = await import('image-type');

        const updatedAttractions = await Promise.all( attractions.map( async (item,index) => {
            //console.log(item.image_data);
            //console.log(JSON.stringify(item));
            if(item.image_data)
            {
                const base64Data = item.image_data.toString('utf-8');
                const bufferData = Buffer.from(base64Data, 'base64');
                const detectedType = await imageType(bufferData);
                const mimetype = detectedType ? detectedType.mime : 'application/octet-stream';
                return {
                    ...item,
                    viewing_image : bufferData.toString('base64'),
                    mimeType :  mimetype
                };
            }
         
            return {
                ...item,
                viewing_image : null,
                mimeType :  null
            };
        }));
        res.writeHead(200, { 'Content-Type': 'application/json' });

        res.end(JSON.stringify({
            success: true,
            data: updatedAttractions
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