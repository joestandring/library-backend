/**
 * CRUD operations for book resource
 * @module models/books
 * @author Joe Standring
 * @see routes/books.js for requests sent to this model
 * @see helpers/database.js for processing SQL queries created by this model
 */

// This file converts requests to valid MySQL syntax
const db = require('../helpers/database.js');

/**
 * Retrieve all book entries in the database using SQL
 * @param {number} page The page number of results to view
 * @param {number} limit The number of results per page
 * @param {string} order How the results are ordered e.g. 'ID', 'Title'
 * @param {string} direction If the results should be displayed in ascending or descending order
 * @returns {object} Results object containing indexable rows
 */
exports.getAll = async function getAll(page, limit, order, direction) {
  const offset = (page - 1) * limit;
  let query;
  if (direction === 'desc') {
    query = 'SELECT * FROM books ORDER BY ?? DESC LIMIT ? OFFSET ?;';
  } else {
    query = 'SELECT * FROM books ORDER BY ?? ASC LIMIT ? OFFSET ?;';
  }
  const values = [order, parseInt(limit, 10), parseInt(offset, 10)];
  const data = await db.runQuery(query, values);
  return data;
};

/**
 * Respond with a single book record specified by id using SQL
 * @param {number} id The ID of the book record to retrieve
 * @returns {object} Results object containing indexable rows
 */
exports.getByID = async function getByID(id) {
  const query = 'SELECT * FROM books WHERE ID = ?;';
  const values = [id];
  const data = await db.runQuery(query, values);
  return data;
};

/**
 * Respond with all book records specified by their owner's id using SQL
 * @param {number} id The ID of the user
 * @returns {object} Results object containing indexable rows
 */
exports.getByUserID = async function getByUserID(id) {
  const query = 'SELECT * FROM books WHERE ownerID = ?;';
  const values = [id];
  const data = await db.runQuery(query, values);
  return data;
};

/**
 * Creates a book record using SQL with values specified in POST request
 * @param {object} book The JSON request data sent by the user
 * @param {number} id The ID of the user who sent the request
 * @returns {object} Results object containing indexable rows
 */
exports.create = async function create(book, id) {
  const query = 'INSERT INTO books SET ?';
  // Owner ID is the authenticated user's ID
  book.ownerID = id;
  const values = [book];
  const data = await db.runQuery(query, values);
  return data;
};

/**
 * Update a specified book record using SQL with values in PUT request
 * @param {object} book The JSON request data sent by the user
 * @returns {object} Results object containing indexable rows
 */
exports.update = async function update(book) {
  const query = 'UPDATE books SET ? WHERE ID = ?;';
  const values = [book, book.ID];
  const data = await db.runQuery(query, values);
  return data;
};

/**
 * Delete a specific book record with specified ID using SQL
 * @params {number} id The ID of the book
 * @returns {object} Results object containing indexable rows
 */
exports.remove = async function remove(id) {
  const query = 'DELETE FROM books WHERE ID = ?;';
  const values = [id];
  const data = await db.runQuery(query, values);
  return data;
};
