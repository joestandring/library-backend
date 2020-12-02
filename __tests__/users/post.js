/**
 * Tests posting to users endpoint
 */

const request = require('supertest');
const app = require('../../app');

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
