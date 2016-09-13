'use strict';

var ReactNative = require('react-native');
var request = require('superagent');
var prefix = require('superagent-prefix')('http://youniappapi.com');

var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

var {
  AsyncStorage
} = ReactNative;

var AjaxUtils = {

  SERVER_URL: 'http://youniappapi.com',

  ajax: function(url, data, onSuccessCallback, onFailureCallback, doNotRetryRequest) {
    var that = this;

    request
     .post(that.SERVER_URL + url)
     .use(prefix)
     .send(data)
     .set('Accept', 'application/json')
     .end(function(err, res) {
       if (that._isRequestSuccessful(res)) {
         if (onSuccessCallback) {
           onSuccessCallback(res);
         }
       }
       else if (doNotRetryRequest) {
         onFailureCallback();
       }
       else {
         that._reLoginAndRetryRequest(url, data, onSuccessCallback, onFailureCallback);
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
  },

  _reLoginAndRetryRequest: function(url, data, onSuccessCallback, onFailureCallback) {
    this.ajax(
      '/api/login',
      {
        username: userLoginMetadataStore.getEmail(),
        password: userLoginMetadataStore.getPassword()
      },
      (res) => {
        this.ajax(url, data, onSuccessCallback, this._forceCrash, true);
      },
      () => {
        if (onFailureCallback) {
          onFailureCallback();
        }
        this._forceCrash();
      }
    );
  },

  _forceCrash: function() {
    var x;
    x = x.y.z;
  }

};

module.exports = AjaxUtils;
