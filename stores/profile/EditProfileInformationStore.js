'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var request = require('superagent');
var prefix = require('superagent-prefix')('http://greedyapi.elasticbeanstalk.com');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var UserUtils = require('../../Utils/User/UserUtils');

var editProfileInformationStore = Unicycle.createStore({

    init: function () {
      this.set({
        isUploadBioRequestInFlight: false,
        isUploadFirstNameRequestInFlight: false,
        isUploadLastNameRequestInFlight: false,
        isGetBlockedUsersRequestInFlight: false,
        isBlockedUsersModalVisible: false,
        blockedUsers: []
      });
    },

    $uploadUserBio: function(userId, bio) {
      var that = this;

      this.set({ isUploadBioRequestInFlight: true });
      request
       .post('/user/updateBio')
       .use(prefix)
       .send({
         userIdString: userId,
         bio: bio
        })
       .set('Accept', 'application/json')
       .end(function(err, res) {
         if ((res !== undefined) && (res.ok)) {
           //no feedback required, view was already optimistically updated
         } else {
           //TODO: Implement a failed case
         }
         that.set({
           isUploadBioRequestInFlight: false
         });
       });
    },

    $updateUserFirstName: function(userId, firstName) {
      var that = this;

      this.set({ isUploadFirstNameRequestInFlight: true });
      request
       .post('/user/updateFirstName')
       .use(prefix)
       .send({
         userIdString: userId,
         firstName: firstName
        })
       .set('Accept', 'application/json')
       .end(function(err, res) {
         if ((res !== undefined) && (res.ok)) {
           //no feedback required, view was already optimistically updated
         } else {
           //TODO: Implement a failed case
         }
         that.set({
           isUploadFirstNameRequestInFlight: false
         });
       });
    },

    $updateUserLastName: function(userId, lastName) {
      var that = this;

      this.set({ isUploadLastNameRequestInFlight: true });
      request
       .post('/user/updateLastName')
       .use(prefix)
       .send({
         userIdString: userId,
         lastName: lastName
        })
       .set('Accept', 'application/json')
       .end(function(err, res) {
         if ((res !== undefined) && (res.ok)) {
           //no feedback required, view was already optimistically updated
         } else {
           //TODO: Implement a failed case
         }
         that.set({
           isUploadLastNameRequestInFlight: false
         });
       });
    },

    $getBlockedUsers: function(email) {
      var that = this;

      this.set({
        isBlockedUsersModalVisible: true,
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
            isGetBlockedUsersRequestInFlight: false,
            blockedUsers: []
          });
        }
      );
    },

    $removeBlock: function(userId, userToUnBlockEmail) {
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
            isRemoveBlockRequestInFlight: false,
            isBlockedUsersModalVisible: false
          });
        },
        () => {
          that.set({
            isRemoveBlockRequestInFlight: false,
            isBlockedUsersModalVisible: false
          });
        }
      );
    },

    $setBlockedUsersModalVisible: function(value) {
      this.set({
        isBlockedUsersModalVisible: value
      });
    },

    isBlockedUsersModalVisible: function() {
      return this.get('isBlockedUsersModalVisible');
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
