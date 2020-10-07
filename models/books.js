/*
 *  models/books.js
 *  CRUD operations for books using requests from routes/books.js
*/

// This file converts requests to valid MySQL syntax
const db = require('../helpers/database.js');

// Functions imported by routes/books.js
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