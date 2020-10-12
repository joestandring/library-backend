/*
 *  models/users.js
 *  CRUD operations for books using requests from routes/users.js
*/

const bcrypt = require('bcrypt');
// db converts requests to valid MySQL syntax
const db = require('../helpers/database.js');

// Functions imported by routes/users.js
// Respond with all users
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

// Respond with a single user specified by id
exports.getByID = async function getByID(id) {
  const query = 'SELECT * FROM users WHERE ID = ?;';
  const values = [id];
  const data = await db.runQuery(query, values);
  return data;
};

// Respond with a single user specified by username
exports.getByUsername = async function getByUsername(username) {
  const query = 'SELECT * FROM users WHERE username = ?;';
  const values = [username];
  const data = await db.runQuery(query, values);
  return data;
};

// Creates a user with values specified in POST request
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

// Update a specified user with values in POST request
exports.update = async function update(user) {
  const query = 'UPDATE users SET ? WHERE ID = ?;';
  const values = [user, user.ID];
  const data = await db.runQuery(query, values);
  return data;
};

// Delete user with specified ID
exports.remove = async function remove(id) {
  const query = 'DELETE FROM users WHERE ID = ?;';
  const values = [id];
  const data = await db.runQuery(query, values);
  return data;
};
