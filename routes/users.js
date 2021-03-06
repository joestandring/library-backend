/**
 * Configure routes for users request and functions to export to model
 * @module routes/users
 * @author Joe Standring
 * @see models/users.js for CRUD operations used by functions in this module
 * @see controllers/auth.js for user authentication
 * @see permissions/users.js for permissions management
 * @see controllers/validation.js for jsonschema validation of requests
 */

// Create an instance of the router object, imported by index.js
const Router = require('koa-router');
// bodyParser is used to extract the body of a HTTP request
const bodyParser = require('koa-bodyparser');
const model = require('../models/users');
// Authenticate routes using auth middleware
const auth = require('../controllers/auth');
// Use the role-acl permissions set up in permissions/users.js
const can = require('../permissions/users');
// Validate routes using validation middleware
const { validateUser } = require('../controllers/validation');

// Use the /users endpoint
const prefix = '/api/v1/users';
const router = Router({ prefix });

/**
 * Send request data to model getAll function
 * @param {object} ctx The Koa request/response context object
 */
async function getAll(ctx) {
  // Run permissions check. Only administrator role should be authorized
  const permission = can.readAll(ctx.state.user);
  // Check failed
  if (!permission.granted) {
    ctx.status = 403;
    ctx.body = 'Permission check failed';
  } else {
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
 * Send request data to model getbyID function
 * @param {object} ctx The Koa request/response context object
 */
async function getByID(ctx) {
  const result = await model.getByID(ctx.params.id);
  // If the response is not empty
  if (result.length) {
    // Run permissions check. Only admins and the single user should be authorized
    const data = result[0];
    const permission = can.read(ctx.state.user, data);
    // Check failed
    if (!permission.granted) {
      ctx.status = 403;
      ctx.body = 'Permission check failed';
    } else {
      // Only show values specified in permissions/users.js
      ctx.body = permission.filter(data);
      ctx.status = 200;
    }
  }
}

/**
 * Send request data to model getByUsername function
 * @param {object} ctx The Koa request/response context object
 */
async function getByUsername(ctx) {
  const result = await model.getByUsername(ctx.params.username);
  if (result.length) {
    // Run permissions check. Only admins and the single user should be authorized
    const data = result[0];
    const permission = can.read(ctx.state.user, data);
    // Check failed
    if (!permission.granted) {
      ctx.status = 403;
      ctx.body = 'Permission check failed';
    } else {
      // Only show values specified in permissions/users.js
      ctx.body = permission.filter(data);
      ctx.status = 200;
    }
  }
}

/**
 * Send request data to model create function
 * @param {object} ctx The Koa request/response context object
 */
async function create(ctx) {
  const result = await model.create(ctx.request.body);
  // If any rows have been changed
  if (result.affectedRows) {
    const id = result.insertId;
    ctx.status = 201;
    ctx.body = { ID: id, created: true, link: `${ctx.request.path}/${id}` };
  }
}

/**
 * Return user details to client when logging in
 * @param {object} ctx The Koa request/response context object
 */
async function login(ctx) {
  // Return details needed by the client
  const {
    ID,
    username,
    email,
    avatarURL,
  } = ctx.state.user;

  const links = {
    // Return link to full record in JSON
    self: `${ctx.protocol}://${ctx.host}${prefix}/${ID}`,
  };
  ctx.body = {
    ID,
    username,
    email,
    avatarURL,
    links,
  };
  ctx.status = 200;
}

/**
 * Send request data to model update function
 * @param {object} ctx The Koa request/response context object
 */
// TODO: Allow updating passwords with bcrypt
async function update(ctx) {
  const { id } = ctx.params;
  // Check if the user exists
  let result = await model.getByID(id);
  // If the response is not empty
  if (result.length) {
    // Run permissions check. Only admins and the single user should be authorized
    const data = result[0];
    const permission = can.update(ctx.state.user, data);
    // Check failed
    if (!permission.granted) {
      ctx.status = 403;
      ctx.body = 'Permission check failed';
    } else {
      // These fields are not updated by the user
      const {
        ID,
        password,
        passwordSalt,
        ...body
      } = ctx.request.body;
      // Update allowed fields
      Object.assign(data, body);
      result = await model.update(data);
      // If any rows have been changed
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
  // Check if the user exists
  let result = await model.getByID(id);
  // If the response is not empty
  if (result.length) {
    // Run permissions check. Only admins and the single user should be authorized
    const data = result[0];
    const permission = can.delete(ctx.state.user, data);
    // Check failed
    if (!permission.granted) {
      ctx.status = 403;
      ctx.body = 'Permission check failed';
    } else {
      result = await model.remove(id);
      // If any rows have been deleted
      if (result.affectedRows) {
        ctx.status = 200;
        ctx.body = { ID: id, deleted: true };
      }
    }
  }
}

// Functions to run on URI and HTTP method (located in modules/users.js)
// 'auth' is used to verify user information BEFORE the model function is run
router.get('/', auth, getAll);
router.get('/:id([0-9]{1,})', auth, getByID);
router.get('/:username', auth, getByUsername);
// 'validateUser' is used to validate body content BEFORE the model function is run
router.post('/', bodyParser(), validateUser, create);
router.post('/login', auth, login);
router.put('/:id([0-9]{1,})', auth, bodyParser(), validateUser, update);
router.del('/:id([0-9]{1,})', auth, remove);

/** Export defined routes */
module.exports = router;
