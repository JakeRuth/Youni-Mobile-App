'use strict';

var Unicycle = require('./../Unicycle');

var userLoginMetadataStore = Unicycle.createStore({

  init: function () {
    this.set({
      accessToken: '',
      refreshToken: '',
      userId: '',
      profileImageUrl: '',
      email: '',
      firstName: '',
      lastName: '',
      networkName: '',
      networkColor: '',
      showTutorialPopup: false
    });
  },

  setAccessToken: function(value) {
    this.set({
      accessToken: value
    });
  },

  setRefreshToken: function(value) {
    this.set({
      refreshToken: value
    });
  },

  setUserId: function(value) {
    this.set({
      userId: value
    });
  },

  setProfileImageUrl: function(value) {
    this.set({
      profileImageUrl: value
    });
  },

  setEmail: function(value) {
    this.set({
      email: value
    });
  },

  setFirstName: function (value) {
    this.set({
      firstName: value
    });
  },

  setLastName: function (value) {
    this.set({
      lastName: value
    });
  },

  setNetworkName: function(value) {
    this.set({
      networkName: value
    });
  },
  
  setNetworkColor: function(value) {
    this.set({
      networkColor: value
    });
  },

  setShowTutorialPopup: function(value) {
    this.set({
      showTutorialPopup: value
    });
  },

  getAccessToken: function () {
    return this.get('accessToken');
  },

  getRefreshToken: function () {
    return this.get('refreshToken');
  },

  getUserId: function () {
    return this.get('userId');
  },
  
  getProfileImageUrl: function() {
    return this.get('profileImageUrl');
  },

  getEmail: function () {
    return this.get('email');
  },

  getFirstName: function () {
    return this.get('firstName');
  },

  getLastName: function () {
    return this.get('lastName');
  },

  getFullName: function () {
    return this.getFirstName() + ' ' + this.getLastName();
  },

  getNetworkName: function () {
    return this.get('networkName');
  },

  getNetworkColor: function () {
    return this.get('networkColor');
  },

  getShouldShowTutorialPopup: function() {
    return this.get('showTutorialPopup');
  }

});

module.exports = userLoginMetadataStore;
