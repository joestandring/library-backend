/**
 * Configure routes for books request and functions to export to model
 * @module routes/books
 * @author Joe Standring
 * @see models/books.js for CRUD operations used by functions in this module
 * @see controllers/auth.js for user authentication
 * @see permissions/books.js for permissions management
 * @see controllers/validation.js for jsonschema validation of requests
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
const prefix = '/api/v1/books';
const router = Router({ prefix: prefix })

/**
 * Send request data to model getAll function
 * @param {object} ctx The Koa request/response context object
 */
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
    ctx.body = result.map(book => {
      // Extract desired fields to return
      const { ID, available, title, summary, imgLink, authorFirst, authorLast, dateAdded, publishYear } = book;
      return { ID, available, title, summary, imgLink, authorFirst, authorLast, dateAdded, publishYear };
    })
  }
}

/**
 * Send request data to model getByID function
 * @param {object} ctx The Koa request/response context object
 */
async function getByID(ctx) {
  const result = await model.getByID(ctx.params.id);
  // If the response is not empty
  if (result.length) {
    ctx.status = 200;
    [ctx.body] = result;
  }
}

/**
 * Send request data to model getByUserID function
 * @param {object} ctx The Koa request/response context object
 */
async function getByUserID(ctx) {
  const result = await model.getByUserID(ctx.params.id);
  // If the response is not empty
  if (result.length) {
    ctx.status = 200;
    ctx.body = result;
  }
}

/**
 * Send request data to model create function
 * @param {object} ctx The Koa request/response context object
 */
async function create(ctx) {
  const result = await model.create(ctx.request.body, ctx.state.user.ID);
  // If any rows have been changed
  if (result.affectedRows) {
    const id = result.insertId;
    ctx.status = 201;
    ctx.body = { ID: id, created: true, link: `${ctx.request.path}/${id}` };
  }
}

/**
 * Send request data to model update function
 * @param {object} ctx The Koa request/response context object
 */
async function update(ctx) {
  const { id } = ctx.params;
  // Check book exists
  let result = await model.getByID(id);
  if (result.length) {
    // Permissions check
    const data = result[0];
    const permission = can.update(ctx.state.user, data);
    // Check failed
    if (!permission.granted) {
      ctx.status = 401;
      ctx.body = 'Permission check failed';
    } else {
      // Fields not updated by user
      const {
        ID,
        ownerID,
        available,
        dateAdded,
        ...body
      } = ctx.request.body;
      // Update allowed fields
      Object.assign(data, body);
      result = await model.update(data);
      // If rows changed
      if (result.affectedRows) {
        ctx.status = 201;
        ctx.body = { ID: id, updated: true, link: ctx.request.path };
      }
    }
  }
}

/**
 * Send request data to model remove function
 * @param {object} ctx The Koa request/response context object
 */
async function remove(ctx) {
  const { id } = ctx.params;
  // Check if book exists
  let result = await model.getByID(id);
  if (result.length) {
    // Permissions check
    const data = result[0];
    const permission = can.delete(ctx.state.user, data);
    // Check failed
    if (!permission.granted) {
      ctx.status = 401;
      ctx.body = 'Permission check failed';
    } else {
      result = await model.remove(id);
      // If rows deleted
      if (result.affectedRows) {
        ctx.status = 200;
        ctx.body = { ID: id, deleted: true };
      }
    }
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

/** Export defined routes */
module.exports = router;
