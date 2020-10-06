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

// Function to run on URI and HTTP method (located in modules/books.js)
router.get('/', getAll);
//router.get('/:id([0-9]{1,})', getByID);
//router.post('/', bodyParser(), create);
//router.put('/:id([0-9]{1,})', update);
//router.del('/:id([0-9]{1,})', remove);

// Respond with all books
function getAll(ctx) {
  ctx.body = books;
  console.log('All books returned');
}

// Export for use in index.js
module.exports = router;
