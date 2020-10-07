/*
 *  routes/books.js
 *  Responds to requests at /api/v1/books with functions in models/books.js
*/

// Create an instance of the router object, imported by index.js
const Router = require('koa-router');
// bodyParser is used to extract the body of a HTTP request
const bodyParser = require('koa-bodyparser');
const model = require('../models/books.js')

// Use the /books endpoint
const router = Router({ prefix: '/api/v1/books' });

// TODO: REPLACE WITH DATABASE
const books = [
  {
    id: 1,
    ownerId: 3,
    available: 1,
    dateAdded: '2020-10-06',
    isbn: '7111196260',
    title: 'The C Programming Language (2nd Edition)',
    imgLink: 'https://pictures.abebooks.com/isbn/9787111196266-uk.jpg',
    authorFirst: 'Brian',
    authorLast: 'Kernighan',
    genre: 'Non-fiction',
    publisher: 'Prentice Hall PTR',
    publishYear: 2009,
  },
  {
    id: 2,
    ownerId: 1,
    available: 1,
    dateAdded: '2020-10-06',
    isbn: '0552124753',
    title: 'Colour of Magic',
    imgLink: 'https://pictures.abebooks.com/isbn/9780552124751-uk.jpg',
    authorFirst: 'Pratchett',
    authorLast: 'Terry',
    genre: 'Fantasy',
    publisher: 'Transworld Publishers Limited',
    publishYear: 1985,
  },
  {
    id: 3,
    ownerId: 2,
    available: 1,
    dateAdded: '2020-10-06',
    isbn: '0575093137',
    title: 'Roadside Picnic',
    imgLink: 'https://pictures.abebooks.com/isbn/9780575093133-uk.jpg',
    authorFirst: 'Arkady',
    authorLast: 'Strugatsky',
    genre: 'Science fiction',
    publisher: 'Macmillan',
    publishYear: 1977,
  },
  {
    id: 4,
    ownerId: 1,
    available: 1,
    dateAdded: '2020-10-06',
    isbn: '0099448475',
    title: 'Sputnik Sweetheart',
    imgLink: 'https://pictures.abebooks.com/isbn/9780099448471-uk.jpg',
    authorFirst: 'Haruki',
    authorLast: 'Murakami',
    genre: 'Contemporary fiction',
    publisher: 'Kodansha',
    publishYear: 1999,
  },
];

// Respond with all books
async function getAll(ctx) {
  // Set default values, overwritten by values in request
  const { page = 1, limit = 100, order = 'dateAdded', direction = 'asc' } = ctx.request.query;
  const result = await model.getAll(page, limit, order, direction);
  // If the response is not empty
  if (result.length) {
    ctx.status = 200;
    ctx.body = result;
  }
}

// Respond with a single book specified by id
async function getByID(ctx) {
  const result = await model.getByID(ctx.params.id);
  // If the response is not empty
  if (result.length) {
    ctx.status = 200;
    ctx.body = result[0];
  }
}

// Creates a book with values specified in POST request
async function create(ctx) {
  const result = await model.create(ctx.request.body);
  // If any rows have been changed
  if (result.affectedRows) {
    const id = result.insertId;
    ctx.status = 201;
    ctx.body = {ID: id, created: true, link: `${ctx.request.path}/${id}`};
  }
}

// Update a specified book with values in POST request
function update(ctx) {
  const { id } = ctx.params;
  const { title, authorLast, publisher } = ctx.request.body;
  // If the ID is valid, update fields to the new values
  if (id > 0 && id <= books.length) {
    const newBook = { title, authorLast, publisher };
    books[id - 1] = newBook;
    ctx.status = 201;
    ctx.body = newBook;
  }
}

// Delete book with specified ID
function remove(ctx) {
  const { id } = ctx.params;
  // If the ID is valid, delete the corresponding book
  if (id > 0 && id <= books.length) {
    books.splice(id - 1, 1);
    ctx.status = 200;
    ctx.body = {
      message: `Book ${id} deleted`,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      message: `No book found with id ${id}`,
    };
  }
}

// Functions to run on URI and HTTP method (located in modules/books.js)
router.get('/', getAll);
router.get('/:id([0-9]{1,})', getByID);
router.post('/', bodyParser(), create);
router.put('/:id([0-9]{1,})', bodyParser(), update);
router.del('/:id([0-9]{1,})', remove);

// Export for use in index.js
module.exports = router;
