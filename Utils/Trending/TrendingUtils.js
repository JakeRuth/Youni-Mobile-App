'use strict';

var AjaxUtils = require('../Common/AjaxUtils');

var TrendingUtils = {

  ajax: function(url, onSuccessCallback, onFailureCallback) {
    AjaxUtils.ajax(url, {}, onSuccessCallback, onFailureCallback);
  },

  generateTrendingUserInfo: function(trendingUsers) {
    var trendingUsersJson = [];

    for (var i = 0; i < trendingUsers.length; i++) {
      var user = trendingUsers[i];
      trendingUsersJson.push({
        firstName: user['firstName'],
        lastName: user['lastName'],
        numFans: user['numFollowers'],
        bio: user['bio'],
        email: user['email'],
        profileImageUrl: user['profileImageUrl'],
        id: i
      });
    }
    return trendingUsersJson;
  }

}

module.exports = TrendingUtils;