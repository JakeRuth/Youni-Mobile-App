'use strict';

var request = require('superagent');
var prefix = require('superagent-prefix')('http://greedyapi.elasticbeanstalk.com');

var AjaxUtils = {

  ajax: function(url, data, onSuccessCallback, onFailureCallback) {
    request
     .post(url)
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

module.exports = AjaxUtils;
