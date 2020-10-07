/*
 *  models/books.js
 *  CRUD operations for books using requests from routes/books.js
*/

// This file converts requests to valid MySQL syntax
const db = require('../helpers/database.js');

// Functions imported by routes/books.js
// Respond with all books
exports.getAll = async function getAll(page, limit, order, direction) {
  const offset = (page - 1) * limit;
  let query;
  if (direction === 'desc') {
    query = 'SELECT * FROM books ORDER BY ?? DESC LIMIT ? OFFSET ?;';
  } else {
    query = 'SELECT * FROM books ORDER BY ?? ASC LIMIT ? OFFSET ?;';
  }
  const values = [order, parseInt(limit), parseInt(offset)];
  const data = await db.runQuery(query, values);
  return data;
}

// Respond with a single book specified by id
exports.getByID = async function getByID(id) {
  const query = 'SELECT * FROM books WHERE ID = ?;';
  const values = [id];
  const data = await db.runQuery(query, values);
  return data;
}

// Creates a book with values specified in POST request
exports.create = async function create(book) {
  const query = 'INSERT INTO books SET ?';
  const values = [book];
  const data = await db.runQuery(query, values);
  return data;
}

// Update a specified book with values in POST request
exports.update = async function update(book) {
  const query = 'UPDATE books SET ? WHERE ID = ?;';
  const values = [book, book.ID];
  const data = await db.runQuery(query, values);
  return data;
}