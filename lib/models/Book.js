const pool = require('../utils/pool');

module.exports = class Book {
  id;
  title;
  author;
  genre;

  constructor(row) {
    this.id = row.id;
    this.title = row.title;
    this.author = row.author;
    this.genre = row.genre;
  }

  static async insert({ title, author, genre }) {
    const { rows } = await pool.query(
      'INSERT INTO books (title, author, genre) VALUES ($1, $2, $3) RETURNING *',
      [title, author, genre]
    );
    return new Book(rows[0]);
  }

  static async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM books WHERE id=$1',
      [id]
    );
    if(!rows[0]) throw new Error(`No book with the id ${id}`);
    return new Book(rows[0]);
  }

  static async update(id, { title, author, genre }) {
    const { rows } = await pool.query(
      `
      UPDATE books
        SET title=$1,
            author=$2,
            genre=$3
      WHERE id=$4
      RETURNING *
      `,
      [title, author, genre, id]
    );
    if(!rows[0]) throw new Error(`No book matching the id ${id}`);
    return new Book(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM books WHERE id=$1 RETURNING *',
      [id]
    );
    if(!rows[0]) throw new Error(`No book matching the id ${id}`);
    return new Book(rows[0]);
  }

};

