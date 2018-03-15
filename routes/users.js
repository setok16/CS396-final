var express = require('express');
var router = express.Router();
var moment = require('moment');
var User = require('../dbcon').User;

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
  User.find({_id: req.params.id}, function(err, user) {
    if (err) {
      var err = new Error(err);
      err.status = 500;
      next(err);
      return;
    }
    res.status(200).send(user[0]);
  });
});

router.post('/', function(req, res, next) {
  var user = new User({
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    joined: moment().format('YYYY-DD-MM')
  });
  user.save(function(err) {
    if (err) { 
      console.log(err);
      res.status(500).send(err);
    } else {
      res.status(200).send('Success');
    }
  });
});

module.exports = router;
