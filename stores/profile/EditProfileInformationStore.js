'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var profileOwnerStore = require('./ProfileOwnerStore');
var userLoginMetadataStore = require('../UserLoginMetadataStore');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var UserUtils = require('../../Utils/User/UserUtils');

var editProfileInformationStore = Unicycle.createStore({

  init: function () {
    this.set({
      firstName: '',
      lastName: '',
      bio: '',
      isBlockedUsersPageVisible: false,
      isUpdateProfileInformationRequestInFlight: false,
      isGetBlockedUsersRequestInFlight: false,
      isRemoveBlockRequestInFlight: false,
      blockedUsers: []
    });
  },
  
  updateProfileInformation: function(callback) {
    var firstName = this.getFirstName(),
        lastName = this.getLastName(),
        bio = this.getBio(),
        userEmail = userLoginMetadataStore.getEmail(),
        that = this;

    this.set({
      isUpdateProfileInformationRequestInFlight: true
    });

    AjaxUtils.ajax(
      '/user/updateProfileInformation',
      {
        userEmail: userEmail,
        firstName: firstName,
        lastName: lastName,
        bio: bio
      },
      (res) => {
        profileOwnerStore.setFirstName(firstName);
        profileOwnerStore.setLastName(lastName);
        profileOwnerStore.setBio(bio);
        callback();
        that.set({
          isUpdateProfileInformationRequestInFlight: false
        });
      },
      () => {
        callback();
        that.set({
          isUpdateProfileInformationRequestInFlight: false
        });
      }
    );
  },

  requestBlockedUsers: function(email) {
    var that = this;

    this.set({
      isBlockedUsersPageVisible: true,
      isGetBlockedUsersRequestInFlight: true
    });

    AjaxUtils.ajax(
      '/user/getBlockedUsers',
      {
        requestingUserEmail: email
      },
      (res) => {
        var blockedUsers = UserUtils.convertResponseUserListToMap(res.body.blockedUsers);
        that.set({
          isGetBlockedUsersRequestInFlight: false,
          blockedUsers: blockedUsers
        });
      },
      () => {
        that.set({
          isBlockedUsersPageVisible: false,
          isGetBlockedUsersRequestInFlight: false,
          blockedUsers: []
        });
      }
    );
  },

  $removeBlock: function(userIndex, userId, userToUnBlockEmail) {
    var that = this;

    this.set({
      isRemoveBlockRequestInFlight: true
    });

    AjaxUtils.ajax(
      '/user/removeBlock',
      {
        requestingUserIdString: userId,
        userToUnBlockEmail: userToUnBlockEmail
      },
      (res) => {
        that.set({
          blockedUsers: UserUtils.removeUserFromList(that.getBlockedUsers(), userIndex),
          isRemoveBlockRequestInFlight: false
        });
      },
      () => {
        that.set({
          isRemoveBlockRequestInFlight: false
        });
      }
    );
  },

  setFirstName: function(firstName) {
    this.set({
      firstName: firstName
    });
  },

  setLastName: function(lastName) {
    this.set({
      lastName: lastName
    });
  },

  setBio: function(bio) {
    this.set({
      bio: bio
    });
  },

  isUpdateProfileInformationRequestInFlight: function() {
    return this.get('isUpdateProfileInformationRequestInFlight');
  },

  isGetBlockedUsersRequestInFlight: function() {
    return this.get('isGetBlockedUsersRequestInFlight');
  },

  isRemoveBlockRequestInFlight: function() {
    return this.get('isRemoveBlockRequestInFlight');
  },

  getBlockedUsers: function() {
    return this.get('blockedUsers');
  },

  getFirstName: function() {
    return this.get('firstName');
  },

  getLastName: function() {
    return this.get('lastName');
  },

  getBio: function() {
    return this.get('bio');
  }

});

module.exports = editProfileInformationStore;
