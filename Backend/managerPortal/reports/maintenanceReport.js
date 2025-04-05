const pool = require('../../database');

const generateMaintenanceReport = async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const reportType = url.searchParams.get('reportType') || 'all';
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const dateType = url.searchParams.get('dateType');
    const orderBy = url.searchParams.get('orderBy');

    try {
        const [sqlModeResult] = await pool.query('SELECT @@SESSION.sql_mode');
        const currentSqlMode = sqlModeResult[0]['@@SESSION.sql_mode'];

        const newSqlMode = currentSqlMode
            .split(',')
            .filter(mode => mode !== 'ONLY_FULL_GROUP_BY')
            .join(',');

        await pool.query(`SET SESSION sql_mode = '${newSqlMode}'`);


        let data = [];
        let summary = {};
        /*
        let combined_summary = {
            total_summary : {},
            dining_summary : {},
            attraction_summary: {},
        };*/
        let combined_summary = {
            total_combined_summary : null,
            attraction_combined_summary : null,
            dining_combined_summary : null
        };


        if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                message: 'Start date cannot be after end date'
            }));
            return;
        }
        try {
        switch (reportType) {
            case 'all':
                data = await getTotalData(startDate, endDate, dateType, orderBy);
                summary = await getTotalSummary(startDate, endDate, dateType);
                combined_summary.total_combined_summary = combineSummary(summary, "total");
                combined_summary.attraction_combined_summary = combineSummary(summary, "attraction");
                combined_summary.dining_combined_summary = combineSummary(summary, "dining");
                break;
            case 'attraction':
                data = await getAttractionData(startDate, endDate, dateType, orderBy);
                summary = await getAttractionSummary(startDate, endDate, dateType);
                combined_summary.attraction_combined_summary = combineSummary(summary, "attraction");
                break;
            case 'dining':
                data = await getDiningData(startDate, endDate, dateType, orderBy);
                summary = await getDiningSummary(startDate, endDate, dateType);
                combined_summary.dining_combined_summary = combineSummary(summary, "dining");
                break;
            default:
                case 'all':
                data = await getTotalData(startDate, endDate, dateType, orderBy);
                summary = await getTotalSummary(startDate, endDate, dateType);
                combined_summary.total_combined_summary = combineSummary(summary, "total");
                combined_summary.attraction_combined_summary = combineSummary(summary, "attraction");
                combined_summary.dining_combined_summary = combineSummary(summary, "dining");

                break;
        }

        function combineSummary(summary, dataToCollect) {
            // Initialize an empty object to hold the combined result
            let combined = {
                maintenance_count : 0,
                cost : 0,
                average_date_difference : 0
            };
            let total_maintenance = 0;
        
            // Iterate over each object in the summary array
            //console.log(summary);
            for(const item of summary){
                
                if(dataToCollect === 'total' || (dataToCollect === 'attraction' && item.isAttraction === 1) || (dataToCollect === 'dining' && item.isAttraction === 0))
                {
                    //console.log(dataToCollect + " " + item.isAttraction);
                    if(item.average_date_difference !== null)
                    {
                        total_maintenance += item.maintenance_count ?? 0;
                        combined.average_date_difference += (Number(item.average_date_difference) * (item.maintenance_count ?? 0)) ?? 0
                    }
                    combined.maintenance_count += item.maintenance_count ?? 0;
                    combined.cost += item.cost ?? 0;
                }
                
            };

            if(total_maintenance !== 0)
            {combined.average_date_difference = combined.average_date_difference / total_maintenance;}
            else
            {combined.average_date_difference = 0;}
        
            return combined;
        }

        //const combinedSummary = combineSummary(summary);
        console.log(`data ${JSON.stringify(data)}`);
        console.log()
        console.log(`summary ${JSON.stringify(summary)}`);
        console.log()
        console.log(`combined summary ${JSON.stringify(combined_summary)}`);
        console.log()
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            data,
            summary,
            combined_summary
        }));
        
        } finally {
            await pool.query(`SET SESSION sql_mode = '${currentSqlMode}'`);
        }
    } catch (error) {
        console.error('Error generating finance report:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: false,
            message: 'Failed to generate finance report',
            error: error.message
        }));
    }
};




const getTotalData = async (startDate, endDate, dateType, orderBy) => {
    let query = `
        SELECT 
            M.maintenance_name AS name,
            COALESCE(A.attraction_name, D.dining_name) AS facility_name,
            M.facility_name AS saved_name,
            M.maintenance_cost AS cost,
            DATE(M.maintenance_date) AS start_date,
            DATE(M.finalized_date) AS end_date,
            DATE(M.expected_completion_date) AS expected_end_date,
            DATEDIFF(M.finalized_date, M.expected_completion_date) AS date_difference 
        FROM maintenance_logs AS M
        LEFT JOIN attractions AS A ON M.attraction_id = A.attraction_id
        LEFT JOIN dining AS D ON M.dining_id = D.dining_id
        WHERE 1 = 1
    `;

    const params = [];
    if (startDate )
    {
        switch (dateType) 
        {
            case 'all':
                query += ` AND finalized_date >= ?`
                break;
            case 'start':
                query += ` AND maintenance_date >= ?`
                break;
            case 'end':
                query += ` AND finalized_date >= ?`
                break;
            default:
                query += ` AND finalized_date >= ?`
                break;
        }
        
        params.push(startDate);
    }

    if ( endDate )
    {
        switch (dateType) 
        {
            case 'all':
                query += ` AND maintenance_date <= ?`
                break;
            case 'start':
                query += ` AND maintenance_date <= ?`
                break;
            case 'end':
                query += ` AND finalized_date <= ?`
                break;
            default:
                query += ` AND maintenance_date <= ?`
                break;
        }
        
        params.push(endDate);
    }


    if(!orderBy || orderBy === 'start')
    {
        query += ` ORDER BY maintenance_date`;
    }
    else
    {
        query += ` ORDER BY finalized_date`;
    }

    const [rows] = await pool.query(query, params);
    return rows;
    
}


const getAttractionData = async (startDate, endDate, dateType, orderBy) => {
    let query = `
    SELECT 
        M.maintenance_name as name,
        A.attraction_name as facility_name,
        M.facility_name AS saved_name,
        M.maintenance_cost as cost,
        DATE(maintenance_date) as start_date,
        DATE(finalized_date) as end_date,
        DATE(expected_completion_date) as expected_end_date,
        DATEDIFF(M.finalized_date, M.expected_completion_date) as date_difference 
    FROM maintenance_logs as M, attractions as A
    WHERE M.attraction_id = A.attraction_id 
    `;

    const params = [];
    if (startDate )
    {
        switch (dateType) 
        {
            case 'all':
                query += ` AND finalized_date >= ?`
                break;
            case 'start':
                query += ` AND maintenance_date >= ?`
                break;
            case 'end':
                query += ` AND finalized_date >= ?`
                break;
            default:
                query += ` AND finalized_date >= ?`
                break;
        }
        
        params.push(startDate);
    }

    if ( endDate )
    {
        switch (dateType) 
        {
            case 'all':
                query += ` AND maintenance_date <= ?`
                break;
            case 'start':
                query += ` AND maintenance_date <= ?`
                break;
            case 'end':
                query += ` AND finalized_date <= ?`
                break;
            default:
                query += ` AND maintenance_date <= ?`
                break;
        }
        
        params.push(endDate);
    }

    if(!orderBy || orderBy === 'start')
    {
        query += ` ORDER BY maintenance_date`;
    }
    else
    {
        query += ` ORDER BY finalized_date`;
    }

    const [rows] = await pool.query(query, params);
    return rows;
    
}

const getDiningData = async (startDate, endDate, dateType, orderBy) => {
    let query = `
    SELECT 
        M.maintenance_name as name,
        D.dining_name as facility_name,
        M.facility_name AS saved_name,
        M.maintenance_cost as cost,
        DATE(maintenance_date) as start_date,
        DATE(finalized_date) as end_date,
        DATE(expected_completion_date) as expected_end_date,
        DATEDIFF(M.finalized_date, M.expected_completion_date) as date_difference 
    FROM maintenance_logs as M, dining as D
    WHERE M.dining_id = D.dining_id
    `;

    const params = [];
    if (startDate )
    {
        switch (dateType) 
        {
            case 'all':
                query += ` AND finalized_date >= ?`
                break;
            case 'start':
                query += ` AND maintenance_date >= ?`
                break;
            case 'end':
                query += ` AND finalized_date >= ?`
                break;
            default:
                query += ` AND finalized_date >= ?`
                break;
        }
        
        params.push(startDate);
    }

    if ( endDate )
    {
        switch (dateType) 
        {
            case 'all':
                query += ` AND maintenance_date <= ?`
                break;
            case 'start':
                query += ` AND maintenance_date <= ?`
                break;
            case 'end':
                query += ` AND finalized_date <= ?`
                break;
            default:
                query += ` AND maintenance_date <= ?`
                break;
        }
        
        params.push(endDate);
    }

    if(!orderBy || orderBy === 'start')
    {
        query += ` ORDER BY maintenance_date`;
    }
    else
    {
        query += ` ORDER BY finalized_date`;
    }

    const [rows] = await pool.query(query, params);
    return rows;
    
}


const getTotalSummary = async (startDate, endDate, dateType) => {
    let query = `
    SELECT 
        COALESCE(A.attraction_name, D.dining_name) AS facility_name,
        M.facility_name AS saved_name,
        COUNT(*) AS maintenance_count,
        COALESCE(SUM(M.maintenance_cost), 0) AS cost,
        AVG(DATEDIFF(M.finalized_date, M.expected_completion_date)) AS average_date_difference,
        CASE
            WHEN A.attraction_name  IS NOT NULL AND D.dining_name IS NULL THEN TRUE
            ELSE FALSE
        END AS isAttraction
    FROM maintenance_logs AS M
    LEFT JOIN attractions AS A ON M.attraction_id = A.attraction_id
    LEFT JOIN dining AS D ON M.dining_id = D.dining_id
    WHERE 1 = 1
    `;

    const params = [];
    if (startDate )
    {
        switch (dateType) 
        {
            case 'all':
                query += ` AND finalized_date >= ?`
                break;
            case 'start':
                query += ` AND maintenance_date >= ?`
                break;
            case 'end':
                query += ` AND finalized_date >= ?`
                break;
            default:
                query += ` AND finalized_date >= ?`
                break;
        }
        
        params.push(startDate);
    }

    if ( endDate )
    {
        switch (dateType) 
        {
            case 'all':
                query += ` AND maintenance_date <= ?`
                break;
            case 'start':
                query += ` AND maintenance_date <= ?`
                break;
            case 'end':
                query += ` AND finalized_date <= ?`
                break;
            default:
                query += ` AND maintenance_date <= ?`
                break;
        }
        
        params.push(endDate);
    }

    query += ` GROUP BY saved_name`

    const [rows] = await pool.query(query, params);
    return rows;
}

const getAttractionSummary = async (startDate, endDate, dateType) => {
    let query = `
    SELECT 
        A.attraction_name as facility_name,
        M.facility_name AS saved_name,
        COUNT(*) AS maintenance_count,
        COALESCE(SUM(M.maintenance_cost),0) as cost,
        AVG(DATEDIFF(M.finalized_date, M.expected_completion_date)) as average_date_difference,
        TRUE AS isAttraction 
    FROM maintenance_logs as M
    JOIN attractions AS A ON M.attraction_id = A.attraction_id
    WHERE 1 = 1
    `;

    const params = [];
    if (startDate )
    {
        switch (dateType) 
        {
            case 'all':
                query += ` AND finalized_date >= ?`
                break;
            case 'start':
                query += ` AND maintenance_date >= ?`
                break;
            case 'end':
                query += ` AND finalized_date >= ?`
                break;
            default:
                query += ` AND finalized_date >= ?`
                break;
        }
        
        params.push(startDate);
    }

    if ( endDate )
    {
        switch (dateType) 
        {
            case 'all':
                query += ` AND maintenance_date <= ?`
                break;
            case 'start':
                query += ` AND maintenance_date <= ?`
                break;
            case 'end':
                query += ` AND finalized_date <= ?`
                break;
            default:
                query += ` AND maintenance_date <= ?`
                break;
        }
        
        params.push(endDate);
    }

    query += ` GROUP BY saved_name`

    const [rows] = await pool.query(query, params);
    return rows;
}



const getDiningSummary = async (startDate, endDate, dateType) => {
    let query = `
    SELECT 
        D.dining_name as facility_name,
        M.facility_name AS saved_name,
        COUNT(*) AS maintenance_count,
        COALESCE(SUM(M.maintenance_cost),0) as cost,
        AVG(DATEDIFF(M.finalized_date, M.expected_completion_date)) as average_date_difference,
        FALSE AS isAttraction 
    FROM maintenance_logs as M
    JOIN dining AS D ON M.dining_id = D.dining_id
    WHERE 1 = 1
    `;

    const params = [];
    if (startDate )
    {
        switch (dateType) 
        {
            case 'all':
                query += ` AND finalized_date >= ?`
                break;
            case 'start':
                query += ` AND maintenance_date >= ?`
                break;
            case 'end':
                query += ` AND finalized_date >= ?`
                break;
            default:
                query += ` AND finalized_date >= ?`
                break;
        }
        
        params.push(startDate);
    }

    if ( endDate )
    {
        switch (dateType) 
        {
            case 'all':
                query += ` AND maintenance_date <= ?`
                break;
            case 'start':
                query += ` AND maintenance_date <= ?`
                break;
            case 'end':
                query += ` AND finalized_date <= ?`
                break;
            default:
                query += ` AND maintenance_date <= ?`
                break;
        }
        
        params.push(endDate);
    }

    query += ` GROUP BY saved_name`

    const [rows] = await pool.query(query, params);
    return rows;
}




module.exports = {
    generateMaintenanceReport
};