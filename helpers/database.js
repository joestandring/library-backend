// Interface to MySQL

const mysql = require('promise-mysql');
const info = require('../.config.js');

// Called by models. Converts data to valid MySQL query
exports.runQuery = async function runQuery(query, values) {
  try {
    // Run the query in MySQL
    const connection = await mysql.createConnection(info.config);
    const data = await connection.query(query, values);
    await connection.end();
    return data;
  } catch (error) {
    //Display a generic error for security
    throw new Error('Database query error');
  }
};
