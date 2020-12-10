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

  static async insert({ text, bookId }) {
    const { rows } = await pool.query(
      'INSERT INTO pages (text, book_id) VALUES ($1, $2) RETURNING *',
      [text, bookId]
    );
    return new Page(rows[0]);
  }

  static async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM pages WHERE id=$1',
      [id]
    );
    if(!rows[0]) throw new Error(`No page with the id ${id}`);
    return new Page(rows[0]);
  }

  static async update(id, { text }) {
    console.log(id, text);
    const { rows } = await pool.query(
      `
      UPDATE pages
        SET text=$1
      WHERE id=$2
      RETURNING *
      `,
      [text, id]
    );
    console.log(rows[0]);
    if(!rows[0]) throw new Error(`No page matching the id ${id}`);
    return new Page(rows[0]);
  }

};
