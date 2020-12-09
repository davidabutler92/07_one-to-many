const fs = require('fs');
const request = require('supertest');
const app = require('../lib/app');
const pool = require('../lib/utils/pool');

describe('app endpoints', () => {

  beforeEach(() => {
    return pool.query(fs.readFileSync(`${__dirname}/../sql/setup.sql`, 'utf-8'));
  });

  afterAll(() => {
    return pool.end();
  });

  it('should create a new book using POST', async() => {
    const res = await request(app)
      .post('/ap1/v1/books')
      .send({
        title: 'Harry Potter',
        author: 'J.K. Rowling',
        genre: 'Fantasy'
      });
  });

});
