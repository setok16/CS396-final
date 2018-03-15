var express = require('express');
var router = express.Router();
var util = require('../util.js');
require('dotenv').config();
var request = require('request');
var parser = require('xml2json');

/* GET home page. */
router.get('/', function(req, res, next) {
  // Checking for user's OAuth code
  let token = req.get('Authorization');
  util.checkOAuth(token, next).then(function(email) {
    res.status(200).send('Access Granted to ' + email);
    //res.render('index', { title: 'Express' });

    var getOptions = {
      url: 'https://www.goodreads.com/book/isbn/0441172717?key=' + process.env.API_KEY,
      method: 'GET'
    }
    request(getOptions, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var xml = body;
        var json = JSON.parse(parser.toJson(xml));
        console.log(json.GoodreadsResponse.book);
      }
    });

  }).catch(function() {
    return;
  });

});

module.exports = router;
