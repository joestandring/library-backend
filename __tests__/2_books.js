/**
 * Tests posting to books endpoint
 */

const request = require('supertest');
const app = require('../app');

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
        avatar: 1
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
