const pool = require('../utils/pool');

module.exports = class Books {
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

  
}