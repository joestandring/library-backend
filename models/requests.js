/**
 * CRUD operations for requests resource
 * @module models/requests
 * @author Joe Standring
 * @see routes/requests.js for requests sent to this model
 * @see helpers/database.js for processing SQL queries created by this model
 */

// This file converts requests to valid MySQL syntax
const db = require('../helpers/database.js');

/**
 * Retrieve all request entries in the database using SQL
 * @param {number} page The page number of results to view
 * @param {number} limit The number of results per page
 * @param {string} order How the results are ordered e.g. 'ID', 'bookID'
 * @param {string} direction If the results should be displayed in ascending or descending order
 * @returns {object} Results object containing indexable rows
 */
exports.getAll = async function getAll(page, limit, order, direction) {
  const offset = (page - 1) * limit;
  let query;
  if (direction === 'desc') {
    query = 'SELECT * FROM requests ORDER BY ?? DESC LIMIT ? OFFSET ?;';
  } else {
    query = 'SELECT * FROM requests ORDER BY ?? ASC LIMIT ? OFFSET ?;';
  }
  const values = [order, parseInt(limit, 10), parseInt(offset, 10)];
  const data = await db.runQuery(query, values);
  return data;
};

/**
 * Respond with a single request record specified by id using SQL
 * @param {number} id The ID of the request record to retrieve
 * @returns {object} Results object containing indexable rows
 */
exports.getByID = async function getByID(id) {
  const query = 'SELECT * FROM requests WHERE ID = ?;';
  const values = [id];
  const data = await db.runQuery(query, values);
  return data;
};

/**
 * Respond with all request records specified by their owner's id using SQL
 * @param {number} id The ID of the user
 * @returns {object} Results object containing indexable rows
 */
exports.getByUserID = async function getByUserID(id) {
  const query = 'SELECT * FROM requests WHERE userID = ?;';
  const values = [id];
  const data = await db.runQuery(query, values);
  return data;
};

/**
 * Respond with all request records specified by their book's id using SQL
 * @param {number} id The ID of the book
 * @returns {object} Results object containing indexable rows
 */
exports.getByBookID = async function getByBookID(id) {
  const query = 'SELECT * FROM requests WHERE bookID = ?;';
  const values = [id];
  const data = await db.runQuery(query, values);
  return data;
};

/**
 * Creates a request record using SQL with values specified in POST request
 * @param {object} request The JSON request data sent by the user
 * @param {number} id The ID of the user who sent the request
 * @returns {object} Results object containing indexable rows
 */
exports.create = async function create(request, id) {
  const query = 'INSERT INTO requests SET ?';
  // USer ID is the authenticated user's ID
  request.userID = id;
  const values = [request];
  const data = await db.runQuery(query, values);
  return data;
};

/**
 * Update a specified request record using SQL with values in PUT request
 * @param {object} request The JSON request data sent by the user
 * @returns {object} Results object containing indexable rows
 */
exports.update = async function update(request) {
  const query = 'UPDATE requests SET ? WHERE ID = ?;';
  const values = [request, request.ID];
  const data = await db.runQuery(query, values);
  return data;
};

/**
 * Delete a specific request record with specified ID using SQL
 * @params {number} id The ID of the request
 * @returns {object} Results object containing indexable rows
 */
exports.remove = async function remove(id) {
  const query = 'DELETE FROM requests WHERE ID = ?;';
  const values = [id];
  const data = await db.runQuery(query, values);
  return data;
};
