'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var UserUtils = require('../../Utils/User/UserUtils');

var editProfileInformationStore = Unicycle.createStore({

    init: function () {
      this.set({
        isSettingPageVisible: false,
        isBlockedUsersPageVisible: false,
        isUploadBioRequestInFlight: false,
        isUploadFirstNameRequestInFlight: false,
        isUploadLastNameRequestInFlight: false,
        isGetBlockedUsersRequestInFlight: false,
        blockedUsers: []
      });
    },

    $uploadUserBio: function(userId, bio) {
      var that = this;

      this.set({
        isUploadBioRequestInFlight: true
      });

      //TODO: Configure some proper feedback in case of failure, etc.
      AjaxUtils.ajax(
        '/user/updateBio',
        {
          userIdString: userId,
          bio: bio
        },
        (res) => {
          that.set({
            isUploadBioRequestInFlight: false
          });
        },
        () => {
          that.set({
            isUploadBioRequestInFlight: false
          });
        }
      );
    },

    $updateUserFirstName: function(userId, firstName) {
      var that = this;

      this.set({
        isUploadFirstNameRequestInFlight: true
      });

      //TODO: Configure some proper feedback in case of failure, etc.
      AjaxUtils.ajax(
        '/user/updateFirstName',
        {
          userIdString: userId,
          firstName: firstName
        },
        (res) => {
          that.set({
            isUploadFirstNameRequestInFlight: false
          });
        },
        () => {
          that.set({
            isUploadFirstNameRequestInFlight: false
          });
        }
      );
    },

    $updateUserLastName: function(userId, lastName) {
      var that = this;

      this.set({
        isUploadLastNameRequestInFlight: true
      });

      //TODO: Configure some proper feedback in case of failure, etc.
      AjaxUtils.ajax(
        '/user/updateLastName',
        {
          userIdString: userId,
          lastName: lastName
        },
        (res) => {
          that.set({
            isUploadLastNameRequestInFlight: false
          });
        },
        () => {
          that.set({
            isUploadLastNameRequestInFlight: false
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

    setVisibility: function(isVisible) {
      this.set({
        isVisible: isVisible
      });
    },

    isVisible: function() {
      return this.get('isVisible');
    },

    isUploadBioRequestInFlight: function() {
      return this.get('isUploadBioRequestInFlight');
    },

    isUploadFirstNameRequestInFlight: function() {
      return this.get('isUploadFirstNameRequestInFlight');
    },

    isUploadLastNameRequestInFlight: function() {
      return this.get('isUploadLastNameRequestInFlight');
    },

    isGetBlockedUsersRequestInFlight: function() {
      return this.get('isGetBlockedUsersRequestInFlight');
    },

    isRemoveBlockRequestInFlight: function() {
      return this.get('isRemoveBlockRequestInFlight');
    },

    getBlockedUsers: function() {
      return this.get('blockedUsers');
    }

});

module.exports = editProfileInformationStore;
