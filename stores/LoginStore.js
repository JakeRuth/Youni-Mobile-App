'use strict';

var Unicycle = require('../Unicycle');

var showUploadProfileImagePromptStore = require('./ShowUploadProfileImagePromptStore');
var userLoginMetadataStore = require('./UserLoginMetadataStore');
var trendingStore = require('./trending/TrendingStore');

var AsyncStorageUtils = require('../Utils/Common/AsyncStorageUtils');
var AjaxUtils = require('../Utils/Common/AjaxUtils');

var loginStore = Unicycle.createStore({

  init: function() {
    this.set({
      email: '',
      password: '',
      isLoginRequestInFlight: false
    });
  },

  loginRequest: function(successCallback, failureCallback) {
    var that = this,
        email = this.getEmail(),
        password = this.getPassword();

    this.setIsLoginRequestInFlight(true);

    //fixes weird bug where blank password field validates (cannot replicate at command line with api)
    if (!password) {
      password = '~';
    }
    if (!email) {
      email = '~';
    }

    AjaxUtils.ajax(
      '/api/login',
      {
        username: email.toLowerCase(),
        password: password
      },
      (res) => {
        var userId = res.body.userId,
            profileImageUrl = res.body.userProfileImageUrl,
            refreshToken = res.body.refreshToken,
            accessToken = res.body.accessToken,
            email = res.body.username,
            firstName = res.body.firstName,
            lastName = res.body.lastName,
            networkName = res.body.networkName,
            trendingFeedFilter = res.body.trendingFeedFilter,
            trendingFeedType = res.body.trendingFeedType,
            networkColor = res.body.networkColorHexCode,
            hasUploadedProfilePicture = profileImageUrl !== null;

        userLoginMetadataStore.setAccessToken(accessToken);
        userLoginMetadataStore.setRefreshToken(refreshToken);
        userLoginMetadataStore.setUserId(userId);
        userLoginMetadataStore.setProfileImageUrl(profileImageUrl);
        userLoginMetadataStore.setEmail(email);
        userLoginMetadataStore.setPassword(password);
        userLoginMetadataStore.setFirstName(firstName);
        userLoginMetadataStore.setLastName(lastName);
        userLoginMetadataStore.setNetworkName(networkName);
        userLoginMetadataStore.setNetworkColor(networkColor);

        showUploadProfileImagePromptStore.setShowOnHomeFeed(!hasUploadedProfilePicture);
        showUploadProfileImagePromptStore.setShowOnProfilePage(!hasUploadedProfilePicture);

        trendingStore.setSelectedFilter(trendingFeedFilter);
        trendingStore.setSelectedType(trendingFeedType);

        AsyncStorageUtils.saveItem('userId', userId);
        AsyncStorageUtils.saveItem('email', email);
        AsyncStorageUtils.saveItem('password', password);
        AsyncStorageUtils.saveItem('refreshToken', refreshToken);
        AsyncStorageUtils.saveItem('accessToken', accessToken);

        that.setIsLoginRequestInFlight(false);
        successCallback();
      },
      () => {
        that.setIsLoginRequestInFlight(false);
        failureCallback();
      },
      true // do not retry request if failed
    );
  },

  setEmail: function(email) {
    this.set({
      email: email
    });
  },

  setPassword: function(password) {
    this.set({
      password: password
    });
  },

  setIsLoginRequestInFlight: function(value) {
    this.set({
      isLoginRequestInFlight: value
    });
  },

  isLoginRequestInFlight: function() {
    return this.get('isLoginRequestInFlight');
  },

  getEmail: function() {
    return this.get('email');
  },

  getPassword: function() {
    return this.get('password');
  }

});

module.exports = loginStore;
