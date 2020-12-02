/**
 * Tests posting to requests endpoint
 */

const request = require('supertest');
const app = require('../app');

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
      .put('/api/v1/requests/2')
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
    await request(app.callback())
      .get('/api/v1/requests')
      .auth('notauser', 'secret')
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
      .get('/api/v1/requests/3')
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
      .delete('/api/v1/requests/5');
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
      .delete('/api/v1/requests/8')
      .auth('admin', 'secret')
      .expect(200);
  });
});
