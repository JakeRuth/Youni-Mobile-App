'use strict';

var UserUtils = {

  convertResponseUserListToMap: function(rawUsers) {
    var usersJson = null;

    if (rawUsers) {
      usersJson = [];
      for (var i = 0; i < rawUsers.length; i++) {
        var user = this.convertUserToJson(rawUsers[i], i);
        usersJson.push(user);
      }
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
      numPosts: user['numPosts'],
      totalPoints: user['allTimePoints'],
      id: id
    };
  }

}

module.exports = UserUtils;
