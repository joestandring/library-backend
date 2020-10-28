/**
 * Generate OpenAPI and JSDocs documentation
 * @module docs
 * @author Joe Standring
 * @see docs/jsdocs/ for the JSDocs documentation served here
 * @see docs/openapi/index.html for the OpenAPI documentation served here
 * @see schemas/ for the JSON schemas served here
 */

const Koa = require('koa');
const serve = require('koa-static');
const mount = require('koa-mount');

const app = new Koa();

// Serve JSDocs
app.use(mount('/', serve('./docs/jsdocs')));
// Serce OpenAPI
app.use(mount('/openapi', serve('./docs/openapi')));
// Serve schemas
app.use(mount('/schemas', serve('./schemas')));

const port = process.env.PORT || 3030;
app.listen(port);
