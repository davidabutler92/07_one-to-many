const express = require('express');
const app = express();
const Book = require('./models/Book');

app.use(express.json());

app.post('/api/v1/books', (req, res, next) => {
  Book
    .insert(req.body)
    .then(book => res.send(book))
    .catch(next);
});

app.get('/api/v1/books/:id', (req, res, next) => {
  Book
    .findById(req.params.id)
    .then(book => res.send(book))
    .catch(next);
});

app.put('/api/v1/books/:id', (req, res, next) => {
  Book
    .update(req.params.id, req.body)
    .then(book => res.send(book))
    .catch(next);
});

// app.delete(`/api/v1/books/:id`, (req, res, next) => {
//   Book
//     .delete(id)
// });

module.exports = app;
