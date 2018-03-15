var express = require('express');
var router = express.Router();
var request = require('request');
var parser = require('xml2json');
require('dotenv').config();
var Book = require('../dbcon').Book;

router.get('/', function(req, res, next) {
  Book.find({}, function(err, books) {
    if (err) {
      var err = new Error(err);
      err.status = 500;
      next(err);
      return;
    }
    res.status(200).send(books);
  });
});

router.get('/:id', function(req, res, next) {
  Book.find({_id: req.params.id}, function(err, book) {
    if (err) {
      var err = new Error(err);
      err.status = 500;
      next(err);
      return;
    }
    res.status(200).send(book[0]);
  });
});

router.post('/', function(req, res, next) {
  var isbn = req.body.isbn;
  if (!isbn) {
    var err = new Error('No ISBN provided');
    err.status = 408;
    next(err);
    return;
  }
  var getOptions = {
    url: 'https://www.goodreads.com/book/isbn/' + isbn + '?key=' + process.env.API_KEY,
    method: 'GET'
  }
  request(getOptions, function (error, response, body) {
    if (!error &&  response.statusCode == 200) {
      var xml = body; // This API only returns in xml format
      var goodReads = JSON.parse(parser.toJson(xml)).GoodreadsResponse.book;
      var book = new Book({
        isbn,
        title: goodReads.title,
        author: goodReads.authors.author.name,
        pages: Number(goodReads.num_pages),
        rating: Number(goodReads.average_rating)
      });
      book.save(function(err) {
        if (err) {
          var err = new Error(err);
          err.status = 500;
          next(err);
          return;
        }
        res.status(200).send('Success');

      });
    }
  });
});

module.exports = router;
