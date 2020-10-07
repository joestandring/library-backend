/*
 *  routes/books.js
 *  Responds to requests at /api/v1/books with functions in models/books.js
*/

// Create an instance of the router object, imported by index.js
const Router = require('koa-router');
// bodyParser is used to extract the body of a HTTP request
const bodyParser = require('koa-bodyparser');

// Use the /books endpoint 
const router = Router({prefix: '/api/v1/books'});

// TODO: REPLACE WITH DATABASE
let books = [
  {
    id: 1,
    ownerId: 3,
    available: 1,
    dateAdded: '2020-10-06',
    isbn: 7111196260,
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
    isbn: 0552124753,
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
    isbn: 0575093137,
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
    isbn: 0099448475,
    title: 'Sputnik Sweetheart',
    imgLink: 'https://pictures.abebooks.com/isbn/9780099448471-uk.jpg',
    authorFirst: 'Haruki',
    authorLast: 'Murakami',
    genre: 'Contemporary fiction',
    publisher: 'Kodansha',
    publishYear: 1999,
  },
];

// Functions to run on URI and HTTP method (located in modules/books.js)
router.get('/', getAll);
router.get('/:id([0-9]{1,})', getByID);
router.post('/', bodyParser(), create);
router.put('/:id([0-9]{1,})',bodyParser(), update);
//router.del('/:id([0-9]{1,})', remove);

// Respond with all books
function getAll(ctx) {
  ctx.body = books;
  ctx.status = 200;
}

// Respond with a single book specified by id
function getByID(ctx) {
  const id = ctx.params.id;
  // If the ID is valid, present the book with the corresponding id
  if(id > 0 && id <= books.length) {
    ctx.body = books[id - 1];
    ctx.status = 200;
  } else {
    ctx.status = 404;
    ctx.body = {
      message: `No book found with id ${id}`
    };
  }
}

// Creates a book with values specified in POST request
function create(ctx) {
  const {title, authorLast, publisher} = ctx.request.body;
  const newBook = {title: title, authoLast: authorLast, publisher: publisher};
  books.push(newBook);
  ctx.body = newBook;
  ctx.status = 201;
}

// Update a specified book with values in POST request
function update(ctx) {
  const id = ctx.params.id;
  const {title, authorLast, publisher} = ctx.request.body;
  // If the ID is valid, update fields to the new values
  if(id > 0 && id <= books.length) {
    const newBook = {title: title, authorLast: authorLast, publisher: publisher};
    books[id - 1] = newBook;
    ctx.status = 201;
    ctx.body = newBook;
  } else {
    ctx.status = 404;
    ctx.body = {
      message: `No book found with id ${id}`
    }
  }
}

// Export for use in index.js
module.exports = router;
