const pool = require('../database')

async function getData() {
    const sqlQuery = 'SELECT * FROM theme_park.dining;'
    const [rows] = await pool.execute(sqlQuery);
    return rows;
}

async function getDining(req, res) {
    try {
        const dining = await getData();

        // Dynamically import `image-type`
        const { default: imageType } = await import('image-type');

        const updatedDining = await Promise.all( dining.map( async (item,index) => {
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
            data: updatedDining
        }));
    } catch (error) {
        console.error('Error fetching dining:', error);


        res.writeHead(500, { 'Content-Type': 'application/json' });


        res.end(JSON.stringify({
            success: false,
            message: 'Failed to retrieve dining',
            error: error.message
        }));
    }
}

module.exports = { getDining }