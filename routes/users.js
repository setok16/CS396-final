var express = require('express');
var router = express.Router();
var moment = require('moment');
var request = require('request');
var User = require('../dbcon').User;
var Book = require('../dbcon').Book;

router.get('/', function(req, res, next) {
  User.find({}, function(err, users) {
    if (err) {
      var err = new Error(err);
      err.status = 500;
      next(err);
      return;
    }
    res.status(200).send(users);
  });
});

router.get('/:id', function(req, res, next) {
  User.findOne({_id: req.params.id}, function(err, user) {
    if (err) {
      var err = new Error(err);
      err.status = 500;
      next(err);
      return;
    }
      if (!user) {
        var err = new Error('User not found');
        err.status = 404;
        next(err);
        return;
      }
    res.status(200).send(user);
  });
});

router.post('/', function(req, res, next) {
  if (!req.body.fname || !req.body.lname || !req.body.email) {
    var err = new Error('Please provide the fname, lname, and email.');
    err.status = 408;
    next(err);
    return;
  }
  var user = new User({
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    joined: moment()
  });
  user.save(function(err) {
    if (err) { 
      var err = new Error(err);
      err.status = 500;
      next(err);
      return;
    } else {
      res.status(200).send('Success');
    }
  });
});

router.put('/:id', function(req, res, next) {
  User.findByIdAndUpdate(
    req.params.id,
    req.body,
    {new: true},
    (err, user) => {
      if (err) {
        var err = new Error(err);
        err.status = 500;
        next(err);
        return;
      } else {
        if (!user) {
          var err = new Error('User not found');
          err.status = 404;
          next(err);
          return;
        }
          res.status(200).send(user);
      }
    }
  );
});

router.delete('/:id', function(req, res, next) {
  User.findByIdAndRemove(req.params.id, (err, user) => {
    if (err) {
      var err = new Error(err);
      err.status = 500;
      next(err);
      return;
    } else {
      if (!user) {
        var err = new Error('User not found');
        err.status = 404;
        next(err);
        return;
      }
      const response = {
        message: "User successfully deleted",
        id: user._id
      };
      res.status(200).send(response);
    }
  });
});

router.post('/:id/book', function(req, res, next) {

  var postOptions = {
    url: req.protocol + '://' + req.get('host') + '/books',
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    form: { isbn: req.body.isbn }
  }

  request.post(postOptions, (err, response, body) => {
    Book.findOne({ 'isbn': req.body.isbn }, (err, books) => {
      if (err) {
        var err = new Error(err);
        err.status = 500;
        next(err);
        return;
      }
      User.findByIdAndUpdate(
        req.params.id,
        { $push: { books: books._id } },
        {new: true},
        (err, user) => {
          if (err) {
            var err = new Error(err);
            err.status = 500;
            next(err);
            return;
          }
          res.status(200).send(user);
        }
      );
    });
  });
});

router.delete('/:userid/:bookid', function(req, res, next) {
  User.findOneAndUpdate(
    req.params.userid,
    {$pull: { 'books': req.params.bookid } },
    {new: true},
    (err, user) => {
      if (err) {
        var err = new Error(err);
        err.status = 500;
        next(err);
        return;
      }
      res.status(200).send(user);
    }
  );
});

module.exports = router;
