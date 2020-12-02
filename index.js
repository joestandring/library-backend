/**
 * The main entry point for application
 * @module index
 * @author Joe Standring
 * @see app.js For the application to be served
 */

const app = require('./app');

const port = process.env.PORT || 3000;
app.listen(port);
