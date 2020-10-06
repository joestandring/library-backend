// Create instances of Koa and the router object
const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const router = new Router();

// Define function to run depending on the URI and request type
router.get('/api/v1', weclome);

// Runs on GET request to /api/v1. Greets user
function welcome(ctx) {
  ctx.body = {
    message: 'Welcome to the book lending API\nFor help installing and running the server, see README.md'
  }
}

// Use defined routes
app.use(router.Routes());

// Run on specified port
app.listen(3000);