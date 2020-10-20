/*
 *  routes/requests.js
 *  Responds to requests at /api/v1/requests with functions in models/requests.js
*/

// Create an instance of the router object, imported by index.js
const Router = require('koa-router');
// bodyParser is used to extract the body of a HTTP request
const bodyParser = require('koa-bodyparser');
const model = require('../models/requests.js');
// Authenticate routes using auth middleware
const auth = require('../controllers/auth');
// Validate routes using validation middleware
const { validateRequest } = require('../controllers/validation');

// Use the /requests endpoint
const router = Router({ prefix: '/api/v1/requests' });

// Respond with all requests
async function getAll(ctx) {
  // Set default values, overwritten by values in request
  const {
    page = 1,
    limit = 100,
    order = 'ID',
    direction = 'asc',
  } = ctx.request.query;
  const result = await model.getAll(page, limit, order, direction);
  // If the response is not empty
  if (result.length) {
    ctx.status = 200;
    ctx.body = result;
  }
}

// Respond with a single requests specified by id
async function getByID(ctx) {
  const result = await model.getByID(ctx.params.id);
  // If the response is not empty
  if (result.length) {
    ctx.status = 200;
    [ctx.body] = result;
  }
}

// Respond with a single requests specified by the user's id
async function getByUserID(ctx) {
  const result = await model.getByUserID(ctx.params.id);
  // If the response is not empty
  if (result.length) {
    ctx.status = 200;
    ctx.body = result;
  }
}

// Respond with a single requests specified by the book's id
async function getByBookID(ctx) {
  const result = await model.getByBookID(ctx.params.id);
  // If the response is not empty
  if (result.length) {
    ctx.status = 200;
    ctx.body = result;
  }
}

// Creates a requests with values specified in POST request
async function create(ctx) {
  const result = await model.create(ctx.request.body);
  // If any rows have been changed
  if (result.affectedRows) {
    const id = result.insertId;
    ctx.status = 201;
    ctx.body = { ID: id, created: true, link: `${ctx.request.path}/${id}` };
  }
}

// Update a specified requests with values in POST request
async function update(ctx) {
  const { id } = ctx.params;
  // Check if the book exists
  let result = await model.getByID(id);
  // If the response is not empty
  if (result.length) {
    const request = result[0];
    // These fields are not updated by the request
    const {
      ID,
      passwordSalt,
      ...body
    } = ctx.request.body;
    // Update allowed fields
    Object.assign(request, body);
    result = await model.update(request);
    // If any rows have been changed
    if (result.affectedRows) {
      ctx.status = 201;
      ctx.body = { ID: id, updated: true, link: ctx.request.path };
    }
  }
}

// Delete request with specified ID
async function remove(ctx) {
  const { id } = ctx.params;
  const result = await model.remove(id);
  // If any rows have been deleted
  if (result.affectedRows) {
    ctx.status = 200;
    ctx.body = { ID: id, deleted: true };
  }
}

// Functions to run on URI and HTTP method (located in modules/request.js)
// 'auth' is used to verify user information BEFORE the model function is run
router.get('/', auth, getAll);
router.get('/:id([0-9]{1,})', auth, getByID);
router.get('/user/:id([0-9]{1,})', auth, getByUserID);
router.get('/book/:id([0-9]{1,})', auth, getByBookID);
router.post('/', auth, bodyParser(), validateRequest, create);
router.put('/:id([0-9]{1,})', auth, bodyParser(), validateRequest, update);
router.del('/:id([0-9]{1,})', auth, remove);

// Export for use in index.js
module.exports = router;
