'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var Spinner = require('../Common/Spinner');
var notificationStore = require('../../stores/NotificationStore');
var NotificationsList = require('./NotificationsList');

var {
  View,
  Text,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  noNotificationsMessage: {
    alignSelf: 'center',
    fontSize: 20,
    color: '#5C7CFF',
    padding: 20
  }
});

var NotificationsPage = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired
  },

  mixins: [
    Unicycle.listenTo(notificationStore)
  ],

  render: function () {
    var content;

    if (notificationStore.getNotifications().size) {
      content = (
        <NotificationsList navigator={this.props.navigator}/>
      );
    }
    else {
      content = (
        <Text style={styles.noNotificationsMessage}>
          You have no notifications :'(
        </Text>
      );
    }

    return (
      <View style={styles.container}>
        {content}
      </View>
    );
  }

});

module.exports = NotificationsPage;
