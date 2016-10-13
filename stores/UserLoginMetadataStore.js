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
      password: '',
      firstName: '',
      lastName: '',
      networkName: '',
      networkColor: '',
      showInitialInfoPrompts: false,
      shouldShowCompetitionPopup: false,
      showUserUpdateMessageForFinishedCompetition: false
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

  setPassword: function(value) {
    this.set({
      password: value
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
  
  setShowInitialInfoPrompts: function(value) {
    this.set({
      showInitialInfoPrompts: value
    });
  },
  
  setShouldShowCompetitionPopup: function(value) {
    this.set({
      shouldShowCompetitionPopup: value
    });
  },
  
  setShowUserUpdateMessageForFinishedCompetition: function(value) {
    this.set({
      showUserUpdateMessageForFinishedCompetition: value
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

  getPassword: function() {
    return this.get('password');
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
  
  getShowInitialInfoPrompts: function() {
    return this.get('showInitialInfoPrompts');
  },
  
  getShouldShowCompetitionPopup: function() {
    return this.get('shouldShowCompetitionPopup');
  },
  
  getShowUserUpdateMessageForFinishedCompetition: function() {
    return this.get('showUserUpdateMessageForFinishedCompetition');
  }

});

module.exports = userLoginMetadataStore;
