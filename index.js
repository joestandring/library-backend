/**
 * The main entry point for application
 * @module index
 * @author Joe Standring
 * @see routes/ For the routes exported and used here
 */

// Create instances of Koa and the router object
const Koa = require('koa');
const Router = require('koa-router');
const cord = require('@koa/cors');

const app = new Koa();
const router = new Router();

// Import route files
const books = require('./routes/books.js');
const users = require('./routes/users.js');
const requests = require('./routes/requests.js');

// Use CORS to allow API use on other domains
app.use(cors());

/**
 * Greets the user on GET request
 * @param {object} ctx The Koa request/response context object
 */
function welcome(ctx) {
  ctx.body = {
    message: 'Welcome to the book lending API. For help installing and running the server, see README.md',
  };
}

// Define function to run depending on the URI and request type
router.get('/api/v1', welcome);

// Use defined routes
app.use(router.routes());
app.use(books.routes());
app.use(users.routes());
app.use(requests.routes());

// Run on specified port
app.listen(3000);
