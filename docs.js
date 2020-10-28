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
