require('dotenv').config();
var request = require('request');

module.exports = {
  checkAuth: function(auth, next) {
    if (auth != process.env.USER_1_AUTH && auth != process.env.USER_2_AUTH) {
      var err = new Error('Unauthorized User');
      err.status = 401;
      next(err);
      return true;
    }
  },

  checkOAuth: function(token, next) {
    return new Promise((resolve, reject) => {
      var authorization = 'Bearer ' + token;
      var getOptions = {
        url: 'https://www.googleapis.com/plus/v1/people/me',
        method: 'GET',
        headers: {
          'Authorization': authorization
        }
      };
      request(getOptions, function(error, response, body) {
        //console.log(response.body);
        if (!error && response.statusCode == 200) {
          var body = JSON.parse(response.body);
          var email = body.emails[0].value;
          console.log(email);
          if (email != process.env.EMAIL1 && email != process.env.EMAIL2) {
            var err = new Error('Unauthorized User');
            err.status = 401;
            next(err);
            reject();
          } else {
            resolve(email);
          }
        } else {
          console.log("HERE!");
          var err = new Error('Invalid OAuth Code');
          err.status = 401;
          next(err);
          reject();
        }
      });
    });
  }
};
