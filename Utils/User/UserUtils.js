'use strict';

var UserUtils = {

  convertResponseUserListToMap: function(rawUsers) {
    var usersJson = [];

    for (var i = 0; i < rawUsers.length; i++) {
      var user = this.convertUserToJson(rawUsers[i], i);
      usersJson.push(user);
    }
    return usersJson;
  },

  convertUserToJson: function(user, id) {
    return {
      firstName: user['firstName'],
      lastName: user['lastName'],
      numFollowers: user['numFollowers'],
      bio: user['bio'],
      email: user['email'],
      profileImageUrl: user['profileImageUrl'],
      id: id
    };
  }

}

module.exports = UserUtils;
