const mysql = require('mysql2');
require("dotenv").config()


const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
})

const promisePool = pool.promise();

// Test connection
promisePool.query('SELECT 1')
    .then(() => console.log('Database connection successful'))
    .catch((err) => console.error('Database connection failed', err));
    
module.exports = pool.promise()