/**
 * A module to run SQL queries on MySQL on behalf of the API models
 * @module helpers/database
 * @author Joe Standring
 * @see models/* for the models that require this module
 * @see .config.js for the MySQL configuration
 */

const mysql = require('promise-mysql');
const info = require('../.config.js');

/**
 * Run an SQL query against the database, end the connection and return the result
 * @param {string} query SQL query string in sqljs format
 * @param {array|number|string} values The values to inject into the query string
 * @returns {object} mysqljs results object containing indexable rows
 * @throws {DatabaseException} Custom exception for database query failiure
 */
exports.runQuery = async function runQuery(query, values) {
  try {
    // Run the query in MySQL
    const connection = await mysql.createConnection(info.config);
    const data = await connection.query(query, values);
    await connection.end();
    return data;
  } catch (error) {
    /**
     * A custom error constructor to re-raise DB errors in a sanitised way
     * @class
     * @param {string} message The error message
     * @param {number|string} code The original error code
     * @param {string} id A UUID for the error instanced
     */
    throw new Error(error);
  }
};
