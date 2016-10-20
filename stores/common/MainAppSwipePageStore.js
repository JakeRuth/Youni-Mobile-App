'use strict';

var Unicycle = require('../../Unicycle');

var userLoginMetadataStore = require('../UserLoginMetadataStore');
var campusChallengeStore = require('../campusChallenge/CampusChallengeStore');

var BasePageIndex = require('../../Utils/Enums/BasePageIndex');

var mainAppSwipePageStore = Unicycle.createStore({

  init: function() {
    this.set({
      currentPageIndex: 2,
      swipeFrameAmount: 0,
      shouldTriggerAutoScroll: false,
      _hasSwipedToExplorePage: false,
      _hasSwipedToHomePage: false,
      _hasSwipedToProfilePage: false
    });
  },

  navigatorTo: function(pageIndex) {
    var currentIndex = this.getCurrentPageIndex();
    if (currentIndex === pageIndex) {
      return;
    }

    var swipeAmount = currentIndex - pageIndex;
    swipeAmount *= -1;
    this.setSwipeFrameAmount(swipeAmount);
  },
  
  setCurrentPageIndex: function(value) {
    this._loadInitialPageData(value);
    this.set({
      currentPageIndex: value
    });
  },
  
  setSwipeFrameAmount: function(value) {
    this.set({
      swipeFrameAmount: value,
      shouldTriggerAutoScroll: true
    });
  },
  
  setShouldTriggerAutoScroll: function(value) {
    this.set({
      shouldTriggerAutoScroll: value
    });
  },
  
  shouldTriggerAutoScroll: function() {
    return this.get('shouldTriggerAutoScroll');
  },

  getCurrentPageIndex: function() {
    return this.get('currentPageIndex')
  },

  getSwipeFrameAmount: function() {
    return this.get('swipeFrameAmount');
  },

  // sooo hacky :(
  _loadInitialPageData: function(pageIndex) {
    var userId = userLoginMetadataStore.getUserId();

    if (pageIndex === BasePageIndex.FEED && !this.get('_hasSwipedToHomePage')) {
      Unicycle.exec('requestHomeFeed', userId);
      this.set({
        _hasSwipedToHomePage: true
      });
    }

    else if (pageIndex === BasePageIndex.EXPLORE && !this.get('_hasSwipedToExplorePage')) {
      Unicycle.exec('requestExploreFeed', userId, true);
      this.set({
        _hasSwipedToExplorePage: true
      });
    }

    else if (pageIndex === BasePageIndex.PROFILE && !this.get('_hasSwipedToProfilePage')) {
      var email = userLoginMetadataStore.getEmail();
      Unicycle.exec('loadOwnerUsersProfile', userLoginMetadataStore.getEmail());
      Unicycle.exec('getOwnerUserPosts', email, userId, true);
      this.set({
        _hasSwipedToProfilePage: true
      });
    }
  }

});

module.exports = mainAppSwipePageStore;
