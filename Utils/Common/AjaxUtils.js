'use strict';

var request = require('superagent');
var prefix = require('superagent-prefix')('http://greedyapi.elasticbeanstalk.com');

var AjaxUtils = {

  ajax: function(url, data, onSuccessCallback, onFailureCallback) {
    var that = this;
    request
     .post(url)
     .use(prefix)
     .send(data)
     .set('Accept', 'application/json')
     .end(function(err, res) {
       if (that._isRequestSuccessful(res)) {
         onSuccessCallback(res);
       }
       else {
         onFailureCallback();
       }
    });
  },

  _isRequestSuccessful(res) {
    return (
      (res !== undefined) &&
      (res.ok) &&
      (res.body !== undefined) &&
      (res.body.success)
    );
  }

}

module.exports = AjaxUtils;
