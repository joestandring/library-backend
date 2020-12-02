/**
 * Tests getting from users endpoint
 */

const request = require('supertest');
const app = require('../../app');

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
      .auth('notauser', 'secret')
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
      .auth('notauser', 'secret')
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
