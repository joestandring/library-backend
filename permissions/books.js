/*
 * permissions/books.js
 * Permissions configuration for books resource (routes/books.js)
*/

const AccessControl = require('role-acl');

const ac = new AccessControl();

// Grant admin read, update, and delete rights for books
ac.grant('admin')
  .execute('read')
  .on('book');
ac.grant('admin')
  .execute('read')
  .on('books');
ac.grant('admin')
  .execute('update')
  .on('book');
ac.grant('admin')
  .execute('delete')
  .on('book');

// Export permissions checks (used by routes/books.js)
// Check if the requester's role parameter allows them to perform the action
exports.readAll = (requester) => ac.can(requester.role)
  .execute('read')
  .sync()
  .on('users');

exports.read = (requester, data) => ac.can(requester.role)
  .context({ requester: requester.ID, owner: data.ID })
  .execute('read')
  .sync()
  .on('user');

exports.update = (requester, data) => ac.can(requester.role)
  .context({ requester: requester.ID, owner: data.ID })
  .execute('update')
  .sync()
  .on('user');

exports.delete = (requester, data) => ac.can(requester.role)
  .context({ requester: requester.ID, owner: data.ID })
  .execute('delete')
  .sync()
  .on('user');