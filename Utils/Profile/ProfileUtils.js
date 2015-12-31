'use strict';

var request = require('superagent');
var prefix = require('superagent-prefix')('http://greedyapi.elasticbeanstalk.com');

var ProfileUtils = {

  getUserPostsAjax: function(data, onSuccessCallback, onFailureCallback) {
    request
     .post('/user/getPosts')
     .use(prefix)
     .send(data)
     .set('Accept', 'application/json')
     .end(function(err, res) {
       if ((res !== undefined) && (res.ok)) {
         onSuccessCallback(res);
       }
       else {
         onFailureCallback();
       }
    });
  }

}

module.exports = ProfileUtils;
