'use strict';

var Unicycle = require('../../Unicycle');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

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
      that._refreshCriticalAppData();
    }, that.refreshDataInterval);
  },

  _refreshCriticalAppData: function() {
    var email = userLoginMetadataStore.getEmail(),
        userId = userLoginMetadataStore.getUserId();

    Unicycle.exec('loadOwnerUsersProfile', email);
    Unicycle.exec('refreshHomeFeed', userId);
    Unicycle.exec('refreshExploreFeed', userId);
    Unicycle.exec('getTrendingUsers');
  }

}

module.exports = RefreshAppContentUtil;
