/**
 * Permissions configuration for requests resource
 * @module permissions/requests
 * @author Joe Standring
 * @see routes/requests.js for where permissions are applied
 */

const AccessControl = require('role-acl');

const ac = new AccessControl();

// Grant user rights for requests
ac.grant('user')
  // The user can either be the books owner or the user who made the request
  .condition({ Fn: 'OR', args: [{ Fn: 'EQUALS', args: { requester: '$.owner' } }, { Fn: 'EQUALS', args: { requester: '$.user' } }] })
  .execute('read')
  .on('request', ['*', '!ID']);
ac.grant('user')
  .condition({ Fn: 'EQUALS', args: { requester: '$.owner' } })
  .execute('update')
  .on('request', ['*', '!ID']);
ac.grant('user')
  .condition({ Fn: 'EQUALS', args: { requester: '$.owner' } })
  .execute('delete')
  .on('request');

// Grant admin rights for requests
ac.grant('admin')
  .execute('read')
  .on('requests');
ac.grant('admin')
  .execute('read')
  .on('request');
ac.grant('admin')
  .execute('update')
  .on('request');
ac.grant('admin')
  .execute('delete')
  .on('request');

// Export permissions checks (used by routes/requests.js)
/** Check if the requester's role parameter allows them to perform the action */
exports.readAll = (requester) => ac.can(requester.role)
  .execute('read')
  .sync()
  .on('requests');
/** Check if the requester's role parameter allows them to perform the action */
exports.read = (requester, bookData, data) => ac.can(requester.role)
  .context({ requester: requester.ID, owner: bookData.ownerID, user: data.userID })
  .execute('read')
  .sync()
  .on('request');
/** Check if the requester's role parameter allows them to perform the action */
exports.update = (requester, data) => ac.can(requester.role)
  .context({ requester: requester.ID, owner: data.userID })
  .execute('update')
  .sync()
  .on('request');
/** Check if the requester's role parameter allows them to perform the action */
exports.delete = (requester, data) => ac.can(requester.role)
  .context({ requester: requester.ID, owner: data.userID })
  .execute('delete')
  .sync()
  .on('request');
