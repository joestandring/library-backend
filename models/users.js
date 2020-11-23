/**
 * CRUD operations for users resource
 * @module models/users
 * @author Joe Standring
 * @see routes/users.js for requests sent to this model
 * @see helpers/database.js for processing SQL queries created by this model
 */

const bcrypt = require('bcrypt');
// db converts requests to valid MySQL syntax
const db = require('../helpers/database.js');

/**
 * Retrieve all user entries in the database using SQL
 * @param {number} page The page number of results to view
 * @param {number} limit The number of results per page
 * @param {string} order How the results are ordered e.g. 'ID', 'lastName'
 * @param {string} direction If the results should be displayed in ascending or descending order
 * @returns {object} Results object containing indexable rows
 */
exports.getAll = async function getAll(page, limit, order, direction) {
  const offset = (page - 1) * limit;
  let query;
  if (direction === 'desc') {
    query = 'SELECT * FROM users ORDER BY ?? DESC LIMIT ? OFFSET ?;';
  } else {
    query = 'SELECT * FROM users ORDER BY ?? ASC LIMIT ? OFFSET ?;';
  }
  const values = [order, parseInt(limit, 10), parseInt(offset, 10)];
  const data = await db.runQuery(query, values);
  return data;
};

/**
 * Respond with a single user record specified by id using SQL
 * @param {number} id The ID of the user record to retrieve
 * @returns {object} Results object containing indexable rows
 */
exports.getByID = async function getByID(id) {
  const query = 'SELECT * FROM users WHERE ID = ?;';
  const values = [id];
  const data = await db.runQuery(query, values);
  return data;
};

/**
 * Respond with a single user record specified by username using SQL
 * @param {string} username The username of the user record to retrieve
 * @returns {object} Results object containing indexable rows
 */
exports.getByUsername = async function getByUsername(username) {
  const query = 'SELECT * FROM users WHERE username = ?;';
  const values = [username];
  const data = await db.runQuery(query, values);
  return data;
};

/**
 * Respond with a single user record specified by username using SQL
 * @param {string} username The username of the user record to retrieve
 * @returns {object} Results object containing indexable rows
 */
exports.getByUsername = async function getByUsername(username) {
  const query = 'SELECT * FROM users WHERE username = ?;';
  const values = [username];
  const data = await db.runQuery(query, values);
  return data;
};

/**
 * Creates a user record using SQL with values specified in POST request
 * @param {object} user The JSON request data sent in POST request
 * @returns {object} Results object containing indexable rows
 */
exports.create = async function create(user) {
  const query = 'INSERT INTO users SET ?';
  const { password } = user;
  // Encrypt the password 10 times
  const hash = bcrypt.hashSync(password, 10);
  user.password = hash;
  const values = [user];
  const data = await db.runQuery(query, values);
  return data;
};

/**
 * Update a specified user record using SQL with values in PUT request
 * @param {object} user The JSON request data sent by the user
 * @returns {object} Results object containing indexable rows
 */
exports.update = async function update(user) {
  const query = 'UPDATE users SET ? WHERE ID = ?;';
  const values = [user, user.ID];
  const data = await db.runQuery(query, values);
  return data;
};

/**
 * Delete a specific user record with specified ID using SQL
 * @params {number} id The ID of the user
 * @returns {object} Results object containing indexable rows
 */
exports.remove = async function remove(id) {
  const query = 'DELETE FROM users WHERE ID = ?;';
  const values = [id];
  const data = await db.runQuery(query, values);
  return data;
};
