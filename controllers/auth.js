/**
 * Authenticate incoming requests using basic auth
 * @module controllers/auth
 * @author Joe Standring
 * @see strategies/basic.js for basic auth implementation
 */

const passport = require('koa-passport');
const basic = require('../strategies/basic');

passport.use(basic);

/** Authenticate request with basic auth. Do not use sessions */
module.exports = passport.authenticate(['basic'], { session: false });
