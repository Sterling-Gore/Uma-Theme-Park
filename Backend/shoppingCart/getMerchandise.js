const pool = require('../database');
const mime = require('mime');
//const imageType = require('image-type');

async function pullData(){
    try{

        const sqlQuery = "SELECT M.merchandise_id, M.merchandise_name, M.merchandise_price, M.stock_amount, M.image_data FROM merchandise AS M;";
        const [rows] = await pool.execute(sqlQuery)
        return rows.length > 0 ? rows : [];
    }catch (err) {
        console.error("Database error:", err);
        throw err;
    }
}


async function getMerchandise(req, res){
    try {
        const merchandise = await pullData();
        
        if (!merchandise || merchandise.length === 0) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                message: "No merchandise found"
            }));
            return;
        }

        // Dynamically import `image-type`
        const { default: imageType } = await import('image-type');

        const merch = await Promise.all( merchandise.map( async (item,index) => {
            //console.log(item.image_data);
            //console.log(JSON.stringify(item));
            const base64Data = item.image_data.toString('utf-8');
            const bufferData = Buffer.from(base64Data, 'base64');
            const detectedType = await imageType(bufferData);
            const mimetype = detectedType ? detectedType.mime : 'application/octet-stream';
            return {
                ...item,
                viewing_image : bufferData.toString('base64'),
                mimeType :  mimetype
            };
        }));

        //console.log(merch)
        
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            data: merch,
            count: merch.length
        }));
    } catch (error) {
        console.error("Error in getMerchandise:", error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: false,
            message: "Internal server error",
            error: error.message
        }));
    }
}

module.exports = {
    getMerchandise
}