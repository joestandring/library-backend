/*
 * permissions/users.js
 * Permissions configuration for users resource (routes/users.js)
*/

const AccessControl = require('role-acl');
const ac = new AccessControl();

// Grant the user role read and update functionality on their own object
// Do not read password or passwordSalt
ac.grant('user')
  .condition({ Fn: 'EQUALS', args: { 'requester': '$.owner' } })
  .execute('read')
  .on('user', ['*', '!password', '!passwordSalt']);
ac.grant('user')
  .condition({ Fn: 'EQUALS', args: { 'requester': '$.owner' } })
  .execute('update')
  .on('user', ['*', '!ID', '!password', '!passwordSalt']);

// Grant admin read, update, and delete rights for users
ac.grant('admin')
  .execute('read')
  .on('user');
ac.grant('admin')
  .execute('read')
  .on('users');
ac.grant('admin')
  .execute('update')
  .on('user');
ac.grant('admin')
  .condition({ Fn: 'NOT_EQUALS', args: { 'requester': '$.owner' } })
  .execute('delete')
  .on('user');

// Export permissions checks (used by routes/users.js)
// Check if the requester's role parameter allows them to perform the action
exports.readAll = (requester) => {
  ac.can(requester.role)
  .execute('read')
  .sync()
  .on('user')
}

exports.read = (requester, data) => {
  ac.can(requester.role)
  .context({ requester: requester.ID, owner:data.ID })
  .execute('read')
  .sync()
  .on('user')
}

exports.update = (requester, data) => {
  ac.can(requester.role)
  .context({ requester: requester.ID, owner:data.ID })
  .execute('update')
  .sync()
  .on('user')
}

exports.delete = (requester, data) => {
  ac.can(requester.role)
  .context({ requester: requester.ID, owner:data.ID })
  .execute('delete')
  .sync()
  .on('user')
}