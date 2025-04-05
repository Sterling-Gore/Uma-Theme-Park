const pool = require('../../database')

async function getData(userID) {
    const getEmployeeAssignmentQuery = `
        SELECT 
            COALESCE(A.attraction_id, D.dining_id) AS id, 
            COALESCE(A.attraction_name, D.dining_name) AS name, 
            COALESCE(A.image_data, D.image_data) AS image_data, 
            COALESCE(A.attraction_status, D.dining_status) AS status,
            CASE 
                WHEN A.attraction_id IS NOT NULL THEN TRUE
                ELSE FALSE
            END AS isAttraction
        FROM theme_park.employee AS E
        LEFT JOIN theme_park.attractions AS A ON A.attraction_id = E.attraction
        LEFT JOIN theme_park.dining AS D ON D.dining_id = E.dining
        WHERE E.employee_id = ?;
    `;

    const [row] = await pool.execute(getEmployeeAssignmentQuery, [userID]);
    return row;
}

async function getEmployeeAssignment(req, res) {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', async () => {
    try {
        const { userID } = JSON.parse(body);
        const assignment = await getData(userID);
        console.log(assignment);

        const { default: imageType } = await import('image-type');

        async function processAssignment(_assignment) {
            const base64Data = _assignment[0].image_data.toString('utf-8');
            const bufferData = Buffer.from(base64Data, 'base64');
            const detectedType = await imageType(bufferData);
            const mimeType = detectedType ? detectedType.mime : 'application/octet-stream';
            const viewing_image = bufferData.toString('base64');
            
            return {
                ..._assignment[0],
                mimeType,
                viewing_image
            };
        }

        let returnedAssignment;
        if(assignment.length === 0) {
            returnedAssignment = null;
        }
        else{
            returnedAssignment = await processAssignment(assignment);
        }

        
        res.writeHead(200, { 'Content-Type': 'application/json' });

        res.end(JSON.stringify({
            success: true,
            data: returnedAssignment
        }));
    } catch (error) {
        console.error('Error fetching assignment:', error);


        res.writeHead(500, { 'Content-Type': 'application/json' });


        res.end(JSON.stringify({
            success: false,
            message: 'Failed to retrieve assignment',
            error: error.message
        }));
    }
    })
}

module.exports = { getEmployeeAssignment }