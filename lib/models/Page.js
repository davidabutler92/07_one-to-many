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
};
