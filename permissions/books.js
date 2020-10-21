/*
 * permissions/books.js
 * Permissions configuration for books resource (routes/books.js)
*/

const AccessControl = require('role-acl');

const ac = new AccessControl();

// Grant user rights for books
ac.grant('user')
  .condition({ Fn: 'EQUALS', args: { requester: '$.owner' } })
  .execute('delete')
  .on('book');
ac.grant('user')
  .condition({ Fn: 'EQUALS', args: { requester: '$.owner' } })
  .execute('update')
  .on('book', ['*', '!ID', '!ownerID', '!available,', '!dateAdded']);

// Grant admin rights for books
ac.grant('admin')
  .execute('update')
  .on('book');
ac.grant('admin')
  .execute('delete')
  .on('book');

// Export permissions checks (used by routes/books.js)
// Check if the requester's role parameter allows them to perform the action
exports.update = (requester, data) => ac.can(requester.role)
  .context({ requester: requester.ID, owner: data.ownerID })
  .execute('update')
  .sync()
  .on('book');

exports.delete = (requester, data) => ac.can(requester.role)
  .context({ requester: requester.ID, owner: data.ownerID })
  .execute('delete')
  .sync()
  .on('book');
