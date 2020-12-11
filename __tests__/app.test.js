const fs = require('fs');
const request = require('supertest');
const app = require('../lib/app');
const pool = require('../lib/utils/pool');
const Book = require('../lib/models/Book');
const Page = require('../lib/models/Page');

describe('app endpoints', () => {

  beforeEach(() => {
    return pool.query(fs.readFileSync(`${__dirname}/../sql/setup.sql`, 'utf-8'));
  });

  afterAll(() => {
    return pool.end();
  });

  it('should create a new book using POST', async() => {
    const res = await request(app)
      .post('/api/v1/books')
      .send({
        title: 'Harry Potter',
        author: 'J.K. Rowling',
        genre: 'Fantasy'
      });
      
    expect(res.body).toEqual({
      id: '1',
      title: 'Harry Potter',
      author: 'J.K. Rowling',
      genre: 'Fantasy'
    });
  });

  it('should get all books', async() => {

  });

  it('should get a book by id using GET', async() => {
    const book = await Book.insert({ 
      title: 'Eragon', 
      author: 'Christopher Paolini', 
      genre: 'Fantasy' 
    });
    const pages = await Promise.all([
      {
        text: 'hello WORLD',
        bookId: book.id
      },
      {
        text: 'something else',
        bookId: book.id
      },
      {
        text: 'brand NEW text',
        bookId: book.id
      }
    ].map(page => Page.insert(page)));

    const res = await request(app)
      .get(`/api/v1/books/${book.id}`);

    expect(res.body).toEqual({
      ...book,
      pages: expect.arrayContaining(pages)
    });
  });

  it('should get all books using GET', async() => {
    const books = await Promise.all([
      {
        title: 'book one',
        author: 'shmit shmitster',
        genre: 'sci-fi'
      },
      {
        title: 'book two',
        author: 'shmit shmitster',
        genre: 'horror'
      },
      {
        title: 'book three',
        author: 'shmit shmitster',
        genre: 'fantasy'
      }  
    ].map(book => Book.insert(book)));

    const res = await request(app)
      .get('/api/v1/books');

    expect(res.body).toEqual(expect.arrayContaining(books));
    expect(res.body).toHaveLength(books.length);
  });

  it('should update a book by id using PUT', async() => {
    const book = await Book.insert({
      title: 'A new book',
      author: 'David Butler',
      genre: 'Horror'
    });

    const res = await request(app)
      .put(`/api/v1/books/${book.id}`)
      .send({
        title: 'A new book',
        author: 'David Butler',
        genre: 'Horror'
      });

    expect(res.body).toEqual({
      id: book.id,
      title: 'A new book',
      author: 'David Butler',
      genre: 'Horror'
    });
  });

  it('should delete a book using DELETE', async() => {
    const book = await Book.insert({ title: 'Harry Potter', author: 'J.K. Rowling', genre: 'Fantasy' });

    const res = await request(app)
      .delete(`/api/v1/books/${book.id}`);

    expect(res.body).toEqual(book);
  });

  //testing routes for Page model

  it('should create a new page using POST', async() => {
    const book = await Book.insert({ title: 'Harry Potter', author: 'J.K. Rowling', genre: 'Fantasy' });
    const res = await request(app)
      .post('/api/v1/pages')
      .send({
        text: 'youre a wizard, harry!',
        bookId: `${book.id}`
      });
      
    expect(res.body).toEqual({
      id: '1',
      text: 'youre a wizard, harry!',
      bookId: book.id
    });
  });

  it('should get a page by id using GET', async() => {
    const book = await Book.insert({ title: 'Harry Potter', author: 'J.K. Rowling', genre: 'Fantasy' });
    const page = await Page.insert({ text: 'youre a wizard, harry!', bookId: book.id });

    const res = await request(app)
      .get(`/api/v1/pages/${page.id}`);

    expect(res.body).toEqual(page);
  });


  it('should get all pages using GET', async() => {
    const book = await Book.insert({ title: 'Harry Potter', author: 'J.K. Rowling', genre: 'Fantasy' });
    const pages = await Promise.all([
      {
        text: 'HARRY POTTER!!!!',
        bookId: book.id
      },
      {
        text: 'something else',
        bookId: book.id
      },
      {
        text: 'dat new new text',
        bookId: book.id
      }
    ].map(page => Page.insert(page)));

    const res = await request(app)
      .get('/api/v1/pages');

    expect(res.body).toEqual(expect.arrayContaining(pages));
    expect(res.body).toHaveLength(pages.length);
  });

  it('should update a page using PUT', async() => {
    const book = await Book.insert({ title: 'Harry Potter', author: 'J.K. Rowling', genre: 'Fantasy' });
    const page = await Page.insert({ text: 'youre a wizard, harry!', bookId: book.id });

    const res = await request(app)
      .put(`/api/v1/pages/${page.id}`)
      .send({
        text: 'something else'
      });

    expect(res.body).toEqual({
      id: page.id,
      text: 'something else',
      bookId: book.id
    });
  });

  it('should delete a page using DELETE', async() => {
    const book = await Book.insert({ title: 'Harry Potter', author: 'J.K. Rowling', genre: 'Fantasy' });
    const page = await Page.insert({ text: 'youre a wizard, harry!', bookId: book.id });

    const res = await request(app)
      .delete(`/api/v1/pages/${page.id}`);

    expect(page).toEqual(res.body);
  });

});
