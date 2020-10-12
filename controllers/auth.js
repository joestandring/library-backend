/*
 *  controllers/auth.js
 *  Authenticate incoming requests using basic auth defined in strategies/basic.js
*/

const passport = require('koa-passport');
const basic = require('../strategies/basic');

passport.use(basic);

// Export the authentication route handler. Does not use sessions to comply with REST
module.exports = passport.authenticate(['basic'], { session: false });
