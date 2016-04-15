'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var OverlayPage = require('../Common/OverlayPage');
var Spinner = require('../Common/Spinner');
var NotificationsPage = require('../Notification/NotificationsPage');
var notificationStore = require('../../stores/NotificationStore');

var {
  View,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  spinnerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

var NotificationsPopup = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired
  },

  mixins: [
    Unicycle.listenTo(notificationStore)
  ],

  getInitialState: function() {
    return {
      isInitialPageLoad: true,
      notifications: null,
      pageOffset: 0,
      moreResultsToFetch: true
    };
  },

  componentDidMount() {
    notificationStore.setOffset(0);
    notificationStore.fetchPage();
  },

  render: function () {
    var pageContent;

    if (notificationStore.isInitialPageLoading()) {
      pageContent = (
        <View style={styles.spinnerContainer}>
          <Spinner/>
        </View>
      );
    }
    else {
      pageContent = (
        <NotificationsPage navigator={this.props.navigator}/>
      );
    }

    return (
      <OverlayPage
        content={pageContent}
        onBackArrowPress={() => {this.props.navigator.pop();}}
        bannerTitle='Notifications'/>
    );
  }

});

module.exports = NotificationsPopup;
