// Create instances of Koa and the router object
const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const router = new Router();

// Import route files
const books = require('./routes/books.js');

// Define function to run depending on the URI and request type
router.get('/api/v1', welcome);

// Runs on GET request to /api/v1. Greets user
function welcome(ctx) {
  ctx.body = {
    message: 'Welcome to the book lending API. For help installing and running the server, see README.md'
  }
}

// Use defined routes
app.use(router.routes());
app.use(books.routes());

// Run on specified port
app.listen(3000);
