'use strict';

var React = require('react-native');
var OverlayPage = require('../Common/OverlayPage');
var NotificationsList = require('../Notification/NotificationsList');
var notificationStore = require('../../stores/NotificationStore');

var NotificationsPopup = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      isInitialPageLoad: true,
      notifications: null,
      pageOffset: 0,
      moreResultsToFetch: true
    };
  },

  render: function () {
    var pageContent = (
      <NotificationsList navigator={this.props.navigator}/>
    );

    return (
      <OverlayPage
        content={pageContent}
        onBackArrowPress={() => {this.props.navigator.pop();}}
        bannerTitle='Notifications'/>
    );
  }

});

module.exports = NotificationsPopup;
