'use strict';

var AjaxUtils = require('../Common/AjaxUtils');

var UserUtils = {

  convertResponseUserListToMap: function(rawUsers) {
    var usersJson = [];

    for (var i = 0; i < rawUsers.length; i++) {
      var user = rawUsers[i];
      usersJson.push({
        firstName: user['firstName'],
        lastName: user['lastName'],
        numFollowers: user['numFollowers'],
        bio: user['bio'],
        email: user['email'],
        profileImageUrl: user['profileImageUrl'],
        id: i
      });
    }
    return usersJson;
  }

}

module.exports = UserUtils;
