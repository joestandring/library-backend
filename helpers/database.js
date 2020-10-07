// Interface to MySQL

const mySQL = require('promise-mysql');
const info = require('../config');

// Called by models. Converts data to valid MySQL query
exports.run_query = async function runQuery(query, values) {
  try {
    // Run the query in MySQL
    const connection = await mysql.createConnection(info.config);
    let data = await connection.query(query, values);
    await connection.end();
    
    return data;
  } catch(error) {
    // Display a generic error for security
    console.error(error, query, values);
    throw 'Database query error';
  }
}