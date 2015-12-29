'use strict';

var request = require('superagent');
var prefix = require('superagent-prefix')('http://greedyapi.elasticbeanstalk.com');

var PostUtils = {

  removePostAjax: function(id, postId, userId, onSuccessCallback, onFailureCallback) {
    request
     .post('/post/removeLike')
     .use(prefix)
     .send({
       postIdString: postId,
       userIdString: userId
     })
     .set('Accept', 'application/json')
     .end(function(err, res) {
       if ((res !== undefined) && (res.ok) && (res.body.success)) {
         onSuccessCallback(id);
       }
       else {
         onFailureCallback();
       }
    });
  }

}

module.exports = PostUtils;
