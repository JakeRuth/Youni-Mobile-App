'use strict';

var ReactNative = require('react-native');
var request = require('superagent');
var prefix = require('superagent-prefix')('http://greedyapi.elasticbeanstalk.com');
var RefreshAppContentUtil = require('./RefreshAppContentUtil');

var {
  AsyncStorage
} = ReactNative;

var AjaxUtils = {

  SERVER_URL: 'http://greedyapi.elasticbeanstalk.com',

  ajax: function(url, data, onSuccessCallback, onFailureCallback) {
    var that = this;
    
    RefreshAppContentUtil.activityTrigger();

    request
     .post(that.SERVER_URL + url)
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
    if (res === undefined || res === null) {
      return false;
    }

    if (!res.ok || !res.body) {
      return false;
    }

    return res.body.success
  }

};

module.exports = AjaxUtils;
