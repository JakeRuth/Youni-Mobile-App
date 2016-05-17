'use strict';

var PostUtils = require('../Post/PostUtils');
var AjaxUtils = require('../Common/AjaxUtils');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

var NotificationUtils = {

  createNotificationEndpointForUser: function(deviceToken) {
    AjaxUtils.ajax(
      '/user/configureForPushNotifications',
      {
        userEmail: 'aescamilla@albany.edu',//userLoginMetadataStore.getEmail(),
        uniqueDeviceToken: deviceToken
      },
      (res) => { },
      () => { }
    );
  },

  convertResponseNotificationListToMap: function(rawNotifications, currentOffset) {
    var notificationsJson = null;

    if (rawNotifications) {
      notificationsJson = [];
      for (var i = 0; i < rawNotifications.length; i++) {
        var notification = this.convertNotificationsToJson(rawNotifications[i], i + currentOffset);

        if (i == rawNotifications.length - 1) {
          notification.isLastItem = true;
        }

        notificationsJson.push(notification);
      }
    }

    return notificationsJson;
  },

  convertNotificationsToJson: function(notification, id) {
    var json = {
      type: notification.type,
      label: notification.label,
      senderName: notification.senderName,
      senderUserProfileImageUrl: notification.senderUserProfileImageUrl,
      explanation: notification.explanation,
      senderEmail: notification.senderEmail,
      isRead: notification.isRead,
      timestamp: notification.timestamp,
      id: id
    };

    if (notification.post) {
      json.post = PostUtils.getPostJson(notification.post, id)
    }

    return json;
  },

  isValidNotificationType: function(type) {
    return type === this.TYPE_LIKE ||
           type === this.TYPE_COMMENT ||
           type === this.TYPE_FOLLOW ||
           type === this.TYPE_SYSTEM
  },

  TYPE_FOLLOW: 'follow',
  TYPE_LIKE: 'like',
  TYPE_COMMENT: 'comment',
  TYPE_SYSTEM: 'system'

};

module.exports = NotificationUtils;
