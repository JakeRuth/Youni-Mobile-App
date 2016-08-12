'use strict';

var immutable = require('immutable');
var Unicycle = require('../Unicycle');
var AjaxUtils = require('../Utils/Common/AjaxUtils');
var NotificationUtils = require('../Utils/Notification/NotificationUtils');
var userLoginMetaDataStore = require('../stores/UserLoginMetadataStore');

var PAGE_SIZE = 25;

var notificationStore = Unicycle.createStore({

  init: function() {
    this.set({
      notifications: [],
      isInitialPageLoad: true,
      isRequestInFlight: false,
      loadingMoreResults: false,
      moreResultsToFetch: true,
      fetchOffsetAmount: 0,
      numUnreadNotifications: 0
    });
  },

  fetchPage: function(callback, shouldCallerRecallThisFunction) {
    var that = this,
        currentOffset = this.getFetchOffsetAmount(),
        currentNotifications = this.getNotifications();

    this.set({
      isRequestInFlight: true
    });

    if (currentOffset == 0) {
      this.set({
        isInitialPageLoad: true
      });
    }

    AjaxUtils.ajax(
      '/notification/fetchForUser',
      {
        recipientEmail: userLoginMetaDataStore.getEmail(),
        maxNumberToFetch: PAGE_SIZE,
        fetchOffsetAmount: currentOffset
      },
      (res) => {
        var notifications = immutable.List(
            NotificationUtils.convertResponseNotificationListToMap(res.body.notifications, currentOffset));

        if (currentOffset && currentNotifications) {
          notifications = currentNotifications.concat(notifications);
        }

        if (callback) {
          callback(notifications, res.body.moreResults);
        }

        that.set({
          notifications: notifications,
          fetchOffsetAmount: currentOffset + PAGE_SIZE,
          moreResultsToFetch: res.body.moreResults,
          isInitialPageLoad: false,
          isRequestInFlight: false
        });

        // pass false to ensure we don't get into an infinite loop of calling this function recursively (hacky base case)
        if (shouldCallerRecallThisFunction) {
          that.fetchPage(callback, false);
        }
      },
      () => {
        that.set({
          isInitialPageLoad: false,
          isRequestInFlight: false
        });
      }
    );
  },

  countUnreadNotifications: function() {
    var that = this;

    AjaxUtils.ajax(
      '/notification/countUnreadForUser',
      {
        email: userLoginMetaDataStore.getEmail(),
        numToInspect: PAGE_SIZE * 2
      },
      (res) => {
        if (res.body.numNewNotifications >= 0) {

          // TODO: Figure out a better place to put this
          if (res.body.numNewNotifications >= PAGE_SIZE * 2) {
            res.body.numNewNotifications = '!';
          }

          this.set({
            numUnreadNotifications: res.body.numNewNotifications
          });
        }
      },
      () => { }
    );
  },

  setOffset: function(offset) {
    this.set({
      fetchOffsetAmount: offset
    });
  },

  resetNumUnreadNotifications: function() {
    this.set({
      numUnreadNotifications: 0
    });
  },

  isInitialPageLoading: function() {
    return this.get('isInitialPageLoad');
  },

  isRequestInFlight: function() {
    return this.get('isRequestInFlight');
  },

  getMoreResultsToFetch: function() {
    return this.get('moreResultsToFetch');
  },

  getFirstPage: function() {
    var notificationsList = [],
        immutableJdNotifications = this.get('notifications');

    for (var i = 0; i < immutableJdNotifications.size; i++) {
      notificationsList.push(immutableJdNotifications.get(i));
    }

    return notificationsList;
  },

  getNotifications: function() {
    return this.get('notifications');
  },

  getUnreadNotifications: function() {
    return this.get('numUnreadNotifications');
  },

  getFetchOffsetAmount: function() {
    return this.get('fetchOffsetAmount');
  }

});

module.exports = notificationStore;
