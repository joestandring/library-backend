const Koa = require('koa');
const serve = require('koa-static');
const mount = require('koa-mount');

const app = new Koa();

// Serve docs/openapi/index.html
app.use(mount('/', serve('./docs/openapi')));
// Serve schemas
app.use(mount('/schemas', serve('./schemas')));

const port = process.env.PORT || 3030;
app.listen(port);
