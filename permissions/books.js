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