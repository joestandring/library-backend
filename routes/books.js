/*
 *  routes/books.js
 *  Responds to requests at /api/v1/books with functions in models/books.js
*/

// Create an instance of the router object, imported by index.js
const Router = require('koa-router');
// bodyParser is used to extract the body of a HTTP request
const bodyParser = require('koa-bodyparser');
const model = require('../models/books.js');
// Authenticate routes using auth middleware
const auth = require('../controllers/auth');
// Use the role-acl permissions set up in permissions/users.js
const can = require('../permissions/books');
// Validate routes using validation middleware
const { validateBook } = require('../controllers/validation');

// Use the /books endpoint
const router = Router({ prefix: '/api/v1/books' });

// Respond with all books
async function getAll(ctx) {
  // Set default values, overwritten by values in request
  const {
    page = 1,
    limit = 100,
    order = 'dateAdded',
    direction = 'asc',
  } = ctx.request.query;
  const result = await model.getAll(page, limit, order, direction);
  // If the response is not empty
  if (result.length) {
    ctx.status = 200;
    ctx.body = result;
  }
}

// Respond with a single book specified by id
async function getByID(ctx) {
  const result = await model.getByID(ctx.params.id);
  // If the response is not empty
  if (result.length) {
    ctx.status = 200;
    [ctx.body] = result;
  }
}

// Respond with books specified by it's owner's ID
async function getByUserID(ctx) {
  const result = await model.getByUserID(ctx.params.id);
  // If the response is not empty
  if (result.length) {
    ctx.status = 200;
    ctx.body = result;
  }
}

// Creates a book with values specified in POST request
async function create(ctx) {
  const result = await model.create(ctx.request.body, ctx.state.user.ID);
  // If any rows have been changed
  if (result.affectedRows) {
    const id = result.insertId;
    ctx.status = 201;
    ctx.body = { ID: id, created: true, link: `${ctx.request.path}/${id}` };
  }
}

// Update a specified book with values in PUT request
async function update(ctx) {
  const { id } = ctx.params;
  // Check if the book is owned by the authenticated user
  if (id === ctx.state.user.ID) {
    // Check if the book exists
    let result = await model.getByID(id);
    // If the response is not empty
    if (result.length) {
      const book = result[0];
      // These fields are not updated by the user
      const {
        ID,
        available,
        dateAdded,
        ownerID,
        ...body
      } = ctx.request.body;
      // Update allowed fields
      Object.assign(book, body);
      result = await model.update(book);
      // If any rows have been changed
      if (result.affectedRows) {
        ctx.status = 201;
        ctx.body = { ID: id, updated: true, link: ctx.request.path };
      }
    }
  } else {
    ctx.status = 403;
    ctx.body = 'You are not permitted to edit this entry';
  }
}

// Delete book with specified ID
async function remove(ctx) {
  const { id } = ctx.params;
  // Check if the book is owned by the authenticated user
  if (id === ctx.state.user.ID) {
    const result = await model.remove(id);
    // If any rows have been deleted
    if (result.affectedRows) {
      ctx.status = 200;
      ctx.body = { ID: id, deleted: true };
    }
  } else {
    ctx.status = 403;
    ctx.body = 'You are not permitted to delete this entry';
  }
}

// Functions to run on URI and HTTP method (located in modules/books.js)
router.get('/', getAll);
router.get('/:id([0-9]{1,})', getByID);
router.get('/user/:id([0-9]{1,})', getByUserID);
// 'auth' is used to verify user information BEFORE the model function is run
router.post('/', auth, bodyParser(), validateBook, create);
router.put('/:id([0-9]{1,})', auth, bodyParser(), validateBook, update);
router.del('/:id([0-9]{1,})', auth, remove);

// Export for use in index.js
module.exports = router;
