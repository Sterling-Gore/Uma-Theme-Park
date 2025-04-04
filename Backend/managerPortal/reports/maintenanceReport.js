const pool = require('../../database');

const generateFinanceReport = async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const reportType = url.searchParams.get('reportType') || 'all';
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const dateType = url.searchParams.get('dateType');
    const orderBy = url.searchParams.get('orderBy');

    try {
        let data = [];
        let summary = {};

        if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                message: 'Start date cannot be after end date'
            }));
            return;
        }

        switch (reportType) {
            case 'all':
                data = await getTotalData(startDate, endDate, dateType);
                summary = await getTotalSummary(startDate, endDate, dateType);
                break;
            case 'attraction':
                data = await getAttractionData(startDate, endDate, dateType);
                summary = await getAttractionSummary(startDate, endDate, dateType);
                break;
            case 'dining':
                data = await getDiningData(startDate, endDate, dateType);
                summary = await getDiningSummary(startDate, endDate, dateType);
                break;
        }

        function combineSummary(summary) {
            // Initialize an empty object to hold the combined result
            const combined = {};
        
            // Iterate over each object in the summary array
            summary.forEach(item => {
                // For each key in the item object, add the value to the combined object
                Object.keys(item).forEach(key => {
                    if (combined[key] === undefined) {
                        combined[key] = item[key];
                    } else {
                        combined[key] += item[key];  // Or use another operation depending on your needs (e.g., sum, concatenation)
                    }
                });
            });
        
            return combined;
        }

        const combinedSummary = combineSummary(summary);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            data,
            summary,
            combinedSummary
        }));
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




const getTotalData = async (startDate, endDate, dateType) => {
    let query = `
        SELECT 
            M.maintenance_name AS name,
            COALESCE(A.attraction_name, D.dining_name) AS facility_name,
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
        }
        
        params.push(endDate);
    }

    if(orderBy === 'start')
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


const getAttractionData = async (startDate, endDate, dateType) => {
    let query = `
    SELECT 
        M.maintenance_name as name,
        A.attraction_name as facility_name,
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
        }
        
        params.push(endDate);
    }

    if(orderBy === 'start')
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

const getDiningData = async (startDate, endDate, dateType) => {
    let query = `
    SELECT 
        M.maintenance_name as name,
        D.dining_name as facility_name,
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
        }
        
        params.push(endDate);
    }

    if(orderBy === 'start')
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
        COUNT(*) AS maintenance_count,
        COALESCE(SUM(M.maintenance_cost), 0) AS cost,
        AVG(DATEDIFF(M.finalized_date, M.expected_completion_date)) AS average_date_difference
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
        }
        
        params.push(endDate);
    }

    query += ` GROUP BY facility_name`

    const [rows] = await pool.query(query, params);
    return rows;
}

const getAttractionSummary = async (startDate, endDate, dateType) => {
    let query = `
    SELECT 
        A.attraction_name as facility_name,
        COUNT(*) AS maintenance_count,
        COALESCE(SUM(M.maintenance_cost),0) as cost,
        AVG(DATEDIFF(M.finalized_date, M.expected_completion_date)) as average_date_difference 
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
        }
        
        params.push(endDate);
    }

    query += ` GROUP BY D.dining_name`

    const [rows] = await pool.query(query, params);
    return rows;
}



const getDiningSummary = async (startDate, endDate, dateType) => {
    let query = `
    SELECT 
        D.dining_name as facility_name,
        COUNT(*) AS maintenance_count,
        COALESCE(SUM(M.maintenance_cost),0) as cost,
        AVG(DATEDIFF(M.finalized_date, M.expected_completion_date)) as average_date_difference 
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
        }
        
        params.push(endDate);
    }

    query += ` GROUP BY D.dining_name`

    const [rows] = await pool.query(query, params);
    return rows;
}




module.exports = {
    generateFinanceReport
};