'use strict';

var React = require('react-native');
var immutable = require('immutable');
var Unicycle = require('../Unicycle');
var AjaxUtils = require('../Utils/Common/AjaxUtils');
var NotificationUtils = require('../Utils/Notification/NotificationUtils');
var userLoginMetaDataStore = require('../stores/UserLoginMetadataStore');

var PAGE_SIZE = 14;

var notificationStore = Unicycle.createStore({

  init: function() {
    this.set({
      notifications: null,
      isInitialPageLoad: true,
      isRequestInFlight: false,
      loadingMoreResults: false,
      moreResultsToFetch: true,
      fetchOffsetAmount: 0
    });
  },

  fetchPage: function(callback) {
    var that = this,
        currentOffset = this.getFetchOffsetAmount(),
        currentNotifications = this.getNotifications();

    this.set({
      isRequestInFlight: true
    });

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
      },
      () => {
        that.set({
          isInitialPageLoad: false,
          isRequestInFlight: false
        });
      }
    );
  },

  setOffset: function(offset) {
    this.set({
      fetchOffsetAmount: offset
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

  getFetchOffsetAmount: function() {
    return this.get('fetchOffsetAmount');
  }

});

module.exports = notificationStore;
