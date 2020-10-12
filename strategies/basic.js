/*
 *  strategies/basic.js
 *  Implements basic http authentication. Used by strategies/auth.js
*/

const { BasicStrategy } = require('passport-http');
const bcrypt = require('bcrypt');
const users = require('../models/users');

// Encrypts the input password and checks if it is equal to the hash stored in the database
const verify = (user, password) => {
  const matches = bcrypt.compareSync(password, user.password);
  return matches;
};

// Checks if user exists and password is correct
const checkLogin = async (username, password, done) => {
  let result;
  // Check if username is in databse
  try {
    result = await users.getByUsername(username);
  } catch (error) {
    return done(error);
  }

  const user = result[0];
  if (result.length && verify(user, password)) {
    // Return the user with no error
    return done(null, user);
  }
  // Return no errors, and that authentication failed
  return done(null, false);
};

// Export the checkLogin function
const strategy = new BasicStrategy(checkLogin);
module.exports = strategy;
