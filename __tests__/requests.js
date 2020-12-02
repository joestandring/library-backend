/**
 * Testing API requests
 */

const request = require('supertest');
const app = require('../app');

// create
describe('Miss required value', () => {
  it('should fail to create a new user', async () => {
    const res = await request(app.callback())
      .post('/api/v1/users')
      .send({
        username: 'testuser',
      });
    expect(res.statuscode).not.toEqual(201);
    expect(res.body).not.toHaveProperty('created', true);
  });
});

describe('Invalid data', () => {
  it('should fail to create a new user', async () => {
    const res = await request(app.callback())
      .post('/api/v1/users')
      .send({
        username: 'testuser',
        password: 'secret',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Surname',
        address1: '1, Example Street',
        city: 'London',
        postcode: 'BADDATA',
      });
    expect(res.statuscode).not.toEqual(201);
    expect(res.body).not.toHaveProperty('created', true);
  });
});

describe('No duplicates', () => {
  it('should fail to create a new user', async () => {
    const res = await request(app.callback())
      .post('/api/v1/users')
      .send({
        username: 'admin',
        password: 'secret',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Surname',
        address1: '1, Example Street',
        city: 'London',
        postcode: 'BADDATA',
      });
    expect(res.statuscode).not.toEqual(201);
    expect(res.body).not.toHaveProperty('created', true);
  });
});

describe('Post valid user', () => {
  it('should create new user successfully', async () => {
    const res = await request(app.callback())
      .post('/api/v1/users')
      .send({
        username: 'testuser',
        password: 'secret',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Surname',
        address1: '1, Example Street',
        city: 'London',
        postcode: 'LO1 1AA',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('created', true);
  });
});

// update
describe('Bad ID provided to update', () => {
  it('should fail to put at user', async () => {
    const res = await request(app.callback())
      .put('/api/v1/users/999')
      .auth('testuser', 'secret')
      .send({
        city: 'Coventry',
      });
    expect(res.statuscode).not.toEqual(201);
  });
});

describe('No auth provided to update', () => {
  it('should fail to put at user', async () => {
    const res = await request(app.callback())
      .put('/api/v1/users/2')
      .send({
        city: 'Coventry',
      });
    expect(res.statuscode).not.toEqual(201);
  });
});

describe('Incorrect auth provided to update', () => {
  it('should fail to put at user', async () => {
    const res = await request(app.callback())
      .put('/api/v1/users/2')
      .auth('notauser', 'secret')
      .send({
        city: 'Coventry',
      });
    expect(res.statuscode).not.toEqual(201);
  });
});

describe('Invalid data', () => {
  it('should fail to put at user', async () => {
    const res = await request(app.callback())
      .put('/api/v1/users/2')
      .auth('notauser', 'secret')
      .send({
        postcode: 'BADDATA',
      });
    expect(res.statuscode).not.toEqual(201);
  });
});

describe('Put valid data at user', () => {
  it('should successfully put at user', async () => {
    await request(app.callback())
      .put('/api/v1/users/5')
      .auth('admin', 'secret')
      .send({
        username: 'testuser',
        password: 'secret',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Surname',
        address1: '1, Example Street',
        city: 'London',
        postcode: 'LO1 1AA',
      })
      .expect(201);
  });
});

// getAll
describe('Non admin request to getAll', () => {
  it('should fail to get all users', async () => {
    const res = await request(app.callback())
      .get('/api/v1/users')
      .auth('testuser', 'secret');
    expect(res.statuscode).not.toEqual(200);
  });
});

describe('No auth provided to getAll', () => {
  it('should fail to get all users', async () => {
    const res = await request(app.callback())
      .get('/api/v1/users');
    expect(res.statuscode).not.toEqual(200);
  });
});

describe('Pass getAll authentication', () => {
  it('should successfully get all users', async () => {
    await request(app.callback())
      .get('/api/v1/users')
      .auth('admin', 'secret')
      .expect(200);
  });
});

// getByID
describe('Bad ID provided to getByID', () => {
  it('should fail to get user', async () => {
    const res = await request(app.callback())
      .get('/api/v1/users/999');
    expect(res.statuscode).not.toEqual(200);
  });
});

describe('No auth provided to getByID', () => {
  it('should fail to get user', async () => {
    const res = await request(app.callback())
      .get('/api/v1/users/1');
    expect(res.statuscode).not.toEqual(200);
  });
});

describe('Incorrect auth provided to getByID', () => {
  it('should fail to get user', async () => {
    const res = await request(app.callback())
      .get('/api/v1/users/1')
      .auth('notauser', 'secret');
    expect(res.statuscode).not.toEqual(200);
  });
});

describe('Correct auth provided to getByID', () => {
  it('should successfully get user', async () => {
    await request(app.callback())
      .get('/api/v1/users/1')
      .auth('testuser', 'secret')
      .expect(200);
  });
});

// getByUsername
describe('Bad username provided to getByUsername', () => {
  it('should fail to get user', async () => {
    const res = await request(app.callback())
      .get('/api/v1/users/notaname');
    expect(res.statuscode).not.toEqual(200);
  });
});

describe('No auth provided to getByUsername', () => {
  it('should fail to get user', async () => {
    const res = await request(app.callback())
      .get('/api/v1/users/testuser');
    expect(res.statuscode).not.toEqual(200);
  });
});

describe('Incorrect auth provided to getByUsername', () => {
  it('should fail to get user', async () => {
    const res = await request(app.callback())
      .get('/api/v1/users/testuser')
      .auth('notauser', 'secret');
    expect(res.statuscode).not.toEqual(200);
  });
});

describe('Correct auth provided to getByUsername', () => {
  it('should successfully get user', async () => {
    await request(app.callback())
      .get('/api/v1/users/testuser')
      .auth('testuser', 'secret')
      .expect(200);
  });
});

// delete
describe('Bad ID provided to delete', () => {
  it('should fail to delete user', async () => {
    const res = await request(app.callback())
      .delete('/api/v1/users/999')
      .auth('admin', 'secret');
    expect(res.statuscode).not.toEqual(200);
  });
});

describe('No auth provided to delete', () => {
  it('should fail to delete user', async () => {
    const res = await request(app.callback())
      .delete('/api/v1/users/5');
    expect(res.statuscode).not.toEqual(200);
  });
});

describe('Incorrect auth provided to delete', () => {
  it('should fail to delete user', async () => {
    const res = await request(app.callback())
      .delete('/api/v1/users/5')
      .auth('notauser', 'secret');
    expect(res.statuscode).not.toEqual(200);
  });
});

describe('Correct auth provided to delete', () => {
  it('should successfully delete user', async () => {
    await request(app.callback())
      .delete('/api/v1/users/5')
      .auth('admin', 'secret')
      .expect(200);
  });
});

// create
describe('Miss required value', () => {
  it('should fail to create a new book', async () => {
    const res = await request(app.callback())
      .post('/api/v1/books')
      .auth('testuser', 'secret')
      .send({
        title: 'testbook',
      });
    expect(res.statuscode).not.toEqual(201);
    expect(res.body).not.toHaveProperty('created', true);
  });
});

describe('No auth provided', () => {
  it('should fail to create a new book', async () => {
    const res = await request(app.callback())
      .post('/api/v1/books')
      .send({
        isbn: '1234567890',
        title: 'testbook',
        authorLast: 'Surname',
      });
    expect(res.statuscode).not.toEqual(201);
  });
});

describe('Incorrect auth provided', () => {
  it('should fail to create a new book', async () => {
    const res = await request(app.callback())
      .post('/api/v1/books/')
      .auth('notauser', 'secret')
      .send({
        isbn: '1234567890',
        title: 'testbook',
        authorLast: 'Surname',
      });
    expect(res.statuscode).not.toEqual(201);
  });
});

// update
describe('Bad ID provided to update', () => {
  it('should fail to put at book', async () => {
    const res = await request(app.callback())
      .put('/api/v1/books/999')
      .auth('testuser', 'secret')
      .send({
        genre: 'sci-fi',
      });
    expect(res.statuscode).not.toEqual(201);
  });
});

describe('No auth provided to update', () => {
  it('should fail to put at book', async () => {
    const res = await request(app.callback())
      .put('/api/v1/books/2')
      .send({
        genre: 'sci-fi',
      });
    expect(res.statuscode).not.toEqual(201);
  });
});

describe('Incorrect auth provided to update', () => {
  it('should fail to put at book', async () => {
    const res = await request(app.callback())
      .put('/api/v1/books/2')
      .auth('notauser', 'secret')
      .send({
        genre: 'sci-fi',
      });
    expect(res.statuscode).not.toEqual(201);
  });
});

describe('Invalid data', () => {
  it('should fail to put at book', async () => {
    const res = await request(app.callback())
      .put('/api/v1/books/2')
      .auth('notauser', 'secret')
      .send({
        avatar: 1,
      });
    expect(res.statuscode).not.toEqual(201);
  });
});

describe('Put valid data at book', () => {
  it('should successfully put at book', async () => {
    await request(app.callback())
      .put('/api/v1/books/2')
      .auth('admin', 'secret')
      .send({
        genre: 'sci-fi',
      })
      .expect(201);
  });
});

// getAll
describe('getAll', () => {
  it('should successfully get all books', async () => {
    await request(app.callback())
      .get('/api/v1/books')
      .expect(200);
  });
});

// getByID
describe('Bad ID provided to getByID', () => {
  it('should fail to get book', async () => {
    const res = await request(app.callback())
      .get('/api/v1/books/999');
    expect(res.statuscode).not.toEqual(200);
  });
});

describe('Successfully getByID', () => {
  it('should successfully get book', async () => {
    await request(app.callback())
      .get('/api/v1/books/3')
      .expect(200);
  });
});

// delete
describe('Bad ID provided to delete', () => {
  it('should fail to delete book', async () => {
    const res = await request(app.callback())
      .delete('/api/v1/books/999')
      .auth('admin', 'secret');
    expect(res.statuscode).not.toEqual(200);
  });
});

describe('No auth provided to delete', () => {
  it('should fail to delete book', async () => {
    const res = await request(app.callback())
      .delete('/api/v1/books/5');
    expect(res.statuscode).not.toEqual(200);
  });
});

describe('Incorrect auth provided to delete', () => {
  it('should fail to delete book', async () => {
    const res = await request(app.callback())
      .delete('/api/v1/books/1')
      .auth('notauser', 'secret');
    expect(res.statuscode).not.toEqual(200);
  });
});

describe('Correct auth provided to delete', () => {
  it('should successfully delete book', async () => {
    await request(app.callback())
      .delete('/api/v1/books/8')
      .auth('admin', 'secret')
      .expect(200);
  });
});

// create
describe('Miss required value', () => {
  it('should fail to create a new request', async () => {
    const res = await request(app.callback())
      .post('/api/v1/requests')
      .auth('testuser', 'secret')
      .send({
        bookID: 3,
        message: 'Test message',
      });
    expect(res.statuscode).not.toEqual(201);
    expect(res.body).not.toHaveProperty('created', true);
  });
});

describe('No auth provided', () => {
  it('should fail to create a new request', async () => {
    const res = await request(app.callback())
      .post('/api/v1/requests')
      .send({
        bookID: 3,
        message: 'Test message',
      });
    expect(res.statuscode).not.toEqual(201);
  });
});

describe('Incorrect auth provided', () => {
  it('should fail to create a new request', async () => {
    const res = await request(app.callback())
      .post('/api/v1/requests/')
      .auth('notauser', 'secret')
      .send({
        bookID: 3,
        message: 'Test message',
      });
    expect(res.statuscode).not.toEqual(201);
  });
});

// update
describe('Bad ID provided to update', () => {
  it('should fail to put at request', async () => {
    const res = await request(app.callback())
      .put('/api/v1/requests/999')
      .auth('testuser', 'secret')
      .send({
        message: 'New message',
      });
    expect(res.statuscode).not.toEqual(201);
  });
});

describe('No auth provided to update', () => {
  it('should fail to put at request', async () => {
    const res = await request(app.callback())
      .put('/api/v1/requests/2')
      .send({
        message: 'New message',
      });
    expect(res.statuscode).not.toEqual(201);
  });
});

describe('Incorrect auth provided to update', () => {
  it('should fail to put at request', async () => {
    const res = await request(app.callback())
      .put('/api/v1/requests/2')
      .auth('notauser', 'secret')
      .send({
        message: 'New message',
      });
    expect(res.statuscode).not.toEqual(201);
  });
});

describe('Invalid data', () => {
  it('should fail to put at request', async () => {
    const res = await request(app.callback())
      .put('/api/v1/requests/2')
      .auth('notauser', 'secret')
      .send({
        bookID: 999,
      });
    expect(res.statuscode).not.toEqual(201);
  });
});

describe('Put valid data at request', () => {
  it('should successfully put at request', async () => {
    await request(app.callback())
      .put('/api/v1/requests/1')
      .auth('admin', 'secret')
      .send({
        message: 'New message',
      })
      .expect(201);
  });
});

// getAll
describe('getAll bad auth', () => {
  it('should fail to get all requests', async () => {
    const res = await request(app.callback())
      .get('/api/v1/requests')
      .auth('notauser', 'secret');
    expect(res.statuscode).not.toEqual(201);
  });
});

describe('getAll', () => {
  it('should successfully get all requests', async () => {
    await request(app.callback())
      .get('/api/v1/requests')
      .auth('admin', 'secret')
      .expect(200);
  });
});

// getByID
describe('Bad ID provided to getByID', () => {
  it('should fail to get requests', async () => {
    const res = await request(app.callback())
      .get('/api/v1/requests/999')
      .auth('admin', 'secret');
    expect(res.statuscode).not.toEqual(200);
  });
});

describe('Successfully getByID', () => {
  it('should successfully get request', async () => {
    await request(app.callback())
      .get('/api/v1/requests/1')
      .auth('admin', 'secret')
      .expect(200);
  });
});

// delete
describe('Bad ID provided to delete', () => {
  it('should fail to delete request', async () => {
    const res = await request(app.callback())
      .delete('/api/v1/requests/999')
      .auth('admin', 'secret');
    expect(res.statuscode).not.toEqual(200);
  });
});

describe('No auth provided to delete', () => {
  it('should fail to delete request', async () => {
    const res = await request(app.callback())
      .delete('/api/v1/requests/1');
    expect(res.statuscode).not.toEqual(200);
  });
});

describe('Incorrect auth provided to delete', () => {
  it('should fail to delete request', async () => {
    const res = await request(app.callback())
      .delete('/api/v1/requests/1')
      .auth('notauser', 'secret');
    expect(res.statuscode).not.toEqual(200);
  });
});

describe('Correct auth provided to delete', () => {
  it('should successfully delete request', async () => {
    await request(app.callback())
      .delete('/api/v1/requests/1')
      .auth('admin', 'secret')
      .expect(200);
  });
});
