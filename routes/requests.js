/**
 * Configure routes for requests request and functions to export to model
 * @module routes/requests
 * @author Joe Standring
 * @see models/requests.js for CRUD operations used by functions in this module
 * @see controllers/auth.js for user authentication
 * @see permissions/requests.js for permissions management
 * @see controllers/validation.js for jsonschema validation of requests
 */

// Create an instance of the router object, imported by index.js
const Router = require('koa-router');
// bodyParser is used to extract the body of a HTTP request
const bodyParser = require('koa-bodyparser');
const model = require('../models/requests');
// Used to get book owner's ID
const booksModel = require('../models/books');
// Authenticate routes using auth middleware
const auth = require('../controllers/auth');
// Use the role-acl permissions set up in permissions/users.js
const can = require('../permissions/requests');
// Validate routes using validation middleware
const { validateRequest } = require('../controllers/validation');

// Use the /requests endpoint
const router = Router({ prefix: '/api/v1/requests' });

/**
 * Send request data to model getAll function
 * @param {object} ctx The Koa request/response context object
 */
async function getAll(ctx) {
  // Run permissions check. Only administrator role should be authorized
  const permission = can.readAll(ctx.state.user);
  // Check failed
  if (!permission.granted) {
    ctx.status = 401;
    ctx.body = 'Permission check failed';
  } else {
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
}

/**
 * Send request data to model getByID function
 * @param {object} ctx The Koa request/response context object
 */
async function getByID(ctx) {
  let result = await model.getByID(ctx.params.id);
  // If the response is not empty
  if (result.length) {
    // Permissions check
    const data = result[0];
    // booksModel needed to also permit book owner
    result = await booksModel.getByID(data.bookID);
    const permission = can.read(ctx.state.user, result[0], data);
    // Check failed
    if (!permission.granted) {
      ctx.status = 401;
      ctx.body = 'Permission check failed';
    } else {
      // Only show values specified in permissions/requests.js
      ctx.body = permission.filter(data);
      ctx.status = 200;
    }
  }
}

/**
 * Send request data to model getByUserID function
 * @param {object} ctx The Koa request/response context object
 */
async function getByUserID(ctx) {
  let result = await model.getByUserID(ctx.params.id);
  // If the response is not empty
  if (result.length) {
    // Permissions check
    const data = result;
    // booksModel needed to also permit book owner
    result = await booksModel.getByID(data.bookID);
    // Only show values specified in permissions/requests.js
    ctx.body = data;
    ctx.status = 200;
  }
}

/**
 * Send request data to model getByBookID function
 * @param {object} ctx The Koa request/response context object
 */
async function getByBookID(ctx) {
  let result = await model.getByBookID(ctx.params.id);
  // If the response is not empty
  if (result.length) {
    // Permissions check
    const data = result;
    // booksModel needed to also permit book owner
    result = await booksModel.getByID(data.bookID);
    ctx.body = data;
    ctx.status = 200;
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
  // Check if the book exists
  let result = await model.getByID(id);
  // If the response is not empty
  if (result.length) {
    // Permissions check
    const data = result[0];
    const permission = can.update(ctx.state.user, data);
    // Check failed
    if (!permission.granted) {
      ctx.status = 401;
      ctx.body = 'Permission check failed';
    } else {
      // These fields are not updated by the user
      const {
        ID,
        userID,
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
  // Check if request exists
  let result = await model.getByID(id);
  // If any rows have been deleted
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

// Functions to run on URI and HTTP method (located in modules/request.js)
// 'auth' is used to verify user information BEFORE the model function is run
router.get('/', auth, getAll);
router.get('/:id([0-9]{1,})', auth, getByID);
router.get('/user/:id([0-9]{1,})', auth, getByUserID);
router.get('/book/:id([0-9]{1,})', auth, getByBookID);
router.post('/', auth, bodyParser(), validateRequest, create);
router.put('/:id([0-9]{1,})', auth, bodyParser(), validateRequest, update);
router.del('/:id([0-9]{1,})', auth, remove);

/** Export defined routes */
module.exports = router;
