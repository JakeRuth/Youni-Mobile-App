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

  removeUserFromList: function(users, userIndexToDelete) {
    users = users.delete(userIndexToDelete);
    users = this._resetUsersJson(users);
    return users;
  },

  _resetUsersJson: function(users) {
    var usersJson = [];

    for (var i = 0; i < users.size; i++) {
      var user = users.get(i);
      usersJson.push(this.convertImmutableUserToJson(user, i));
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
      currentPoints: user['currentPoints'],
      isCurrentlyTrending: user['isCurrentlyTrending'],
      id: id
    };
  },

  // fix this so that we only need one of these methods
  convertImmutableUserToJson: function(user, id) {
    return {
      firstName: user.get('firstName'),
      lastName: user.get('lastName'),
      numFollowers: user.get('numFollowers'),
      bio: user.get('bio'),
      email: user.get('email'),
      profileImageUrl: user.get('profileImageUrl'),
      numPosts: user.get('numPosts'),
      totalPoints: user.get('allTimePoints'),
      currentPoints: user.get('currentPoints'),
      id: id
    };
  }

};

module.exports = UserUtils;
