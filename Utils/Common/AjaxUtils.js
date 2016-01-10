'use strict';

var React = require('react-native');
var request = require('superagent');
var prefix = require('superagent-prefix')('http://greedyapi.elasticbeanstalk.com');
var loginStore = require('../../stores/LoginStore');

var {
  AsyncStorage
} = React;

var AjaxUtils = {

  SERVER_URL: 'http://greedyapi.elasticbeanstalk.com',

  HTTP_CODE_UNAUTHORIZED: 401,

  ajax: function(url, data, onSuccessCallback, onFailureCallback) {
    var that = this;
    request
     .post(that.SERVER_URL + url)
     .use(prefix)
     .send(data)
     .set('Accept', 'application/json')
     .end(function(err, res) {
       if (that._isUserLoggedOut(res.status)) {
         that._refreshAuthTokenAndRetryRequest(url, data, onSuccessCallback, onFailureCallback);
       }
       if (that._isRequestSuccessful(res)) {
         onSuccessCallback(res);
       }
       else {
         onFailureCallback();
       }
    });
  },

  _refreshAuthTokenAndRetryRequest: function(url, data, onSuccessCallback, onFailureCallback) {
    var that = this;

    this.ajax(
      '/api/login',
      {
        username: loginStore.getEmail(),
        password: loginStore.getPassword()
      },
      (res) => {
        that.ajax(url, data, onSuccessCallback, onFailureCallback);
      },
      () => {}
    );
  },

  _isUserLoggedOut: function(httpResponseCode) {
    return httpResponseCode == this.HTTP_CODE_UNAUTHORIZED;
  },

  _isRequestSuccessful(res) {
    return (
      (res !== undefined) &&
      (res.ok) &&
      (res.body !== undefined)
    );
  }

}

module.exports = AjaxUtils;
