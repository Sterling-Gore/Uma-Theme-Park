const mysql = require('mysql');
require('dotenv').config(); 

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    SSL: {
        rejectUnauthorized: false,
    }
});

module.exports = pool;
