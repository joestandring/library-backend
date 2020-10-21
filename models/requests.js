/*
 *  models/requests.js
 *  CRUD operations for books using requests from routes/requests.js
*/

// This file converts requests to valid MySQL syntax
const db = require('../helpers/database.js');

// Functions imported by routes/requests.js
// Respond with all requests
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

// Respond with a single request specified by id
exports.getByID = async function getByID(id) {
  const query = 'SELECT * FROM requests WHERE ID = ?;';
  const values = [id];
  const data = await db.runQuery(query, values);
  return data;
};

// Respond with a single request specified by the user's id
exports.getByUserID = async function getByUserID(id) {
  const query = 'SELECT * FROM requests WHERE userID = ?;';
  const values = [id];
  const data = await db.runQuery(query, values);
  return data;
};

// Respond with a single request specified by the book's id
exports.getByBookID = async function getByBookID(id) {
  const query = 'SELECT * FROM requests WHERE bookID = ?;';
  const values = [id];
  const data = await db.runQuery(query, values);
  return data;
};

// Creates a book with values specified in POST request
exports.create = async function create(request, id) {
  const query = 'INSERT INTO requests SET ?';
  // USer ID is the authenticated user's ID
  request.userID = id;
  const values = [request];
  const data = await db.runQuery(query, values);
  return data;
};

// Update a specified book with values in POST request
exports.update = async function update(request) {
  const query = 'UPDATE requests SET ? WHERE ID = ?;';
  const values = [request, request.ID];
  const data = await db.runQuery(query, values);
  return data;
};

// Delete book with specified ID
exports.remove = async function remove(id) {
  const query = 'DELETE FROM requests WHERE ID = ?;';
  const values = [id];
  const data = await db.runQuery(query, values);
  return data;
};
