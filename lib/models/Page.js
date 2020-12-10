const pool = require('../utils/pool');

module.exports = class Page {
  id;
  text;
  bookId;

  constructor(row) {
    this.id = row.id;
    this.text = row.text;
    this.bookId = row.book_id;
  }

  static async insert({ text, book_id }) {
    const { rows } = await pool.query(
      'INSERT INTO pages (text, book_id) VALUES ($1, $2) RETURNING *',
      [text, book_id]
    );
    console.log(book_id);
    return new Page(rows[0]);
  }
};
