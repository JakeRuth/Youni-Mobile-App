'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var request = require('superagent');
var prefix = require('superagent-prefix')('http://localhost:8080/Greedy');

var {
  AsyncStorage
} = React;

// the purpose of this file is to refresh the app content after every 15 minutes
// of inactivity.  So if there were no tab switches, or no ajax calls for 15
// minutes, the app will start a timing interval to refresh the app data every
// 15 minutes.
// Whenever activity is recoreded (metered), the timer will be cleared and the
// countdown of 15 minutes will be reset
var RefreshAppContentUtil = {

  refreshDataInterval: 900000,  // 15 minutes (in millis)

  refreshDataTimer: null,

  activityTrigger: function() {
    if (this.refreshDataTimer) {
      clearInterval(this.refreshDataTimer);
    }
    this._startTimer();
  },

  _startTimer: function() {
    var that = this;
    this.refreshDataTimer = setInterval(function() {
      that._refreshApp();
    }, that.refreshDataInterval);
  },

  _refreshApp: function() {
    var that = this,
        email = userLoginMetadataStore.getEmail(),
        userId = userLoginMetadataStore.getUserId();

    AsyncStorage.getItem('password').then((password) => {
      that._horribleCopiedMethodBecauseAjaxUtilsCantBeRequiredHereAndIDontKnowWhyImPissed(
        '/api/login',
        {
          username: email,
          password: password
        },
        (res) => {
          Unicycle.exec('loadOwnerUsersProfile', email);
          Unicycle.exec('refreshHomeFeed', userId);
          Unicycle.exec('refreshExploreFeed', userId);
          Unicycle.exec('getTrendingUsers');
        },
        () => {

        }
      );
    }).done();
  },

  //TODO: FIIIXX
  _horribleCopiedMethodBecauseAjaxUtilsCantBeRequiredHereAndIDontKnowWhyImPissed: function(url, data, onSuccessCallback, onFailureCallback) {
    var that = this;

    request
     .post(that.SERVER_URL + url)
     .use(prefix)
     .send(data)
     .set('Accept', 'application/json')
     .end(function(err, res) {
       onSuccessCallback();
     });
  }

}

module.exports = RefreshAppContentUtil;
