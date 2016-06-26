'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var Unicycle = require('../../Unicycle');
var NotificationCallout = require('./NotificationCallout');
var NotificationsPopup = require('../PopupPages/NotificationsPopup');
var notificationStore = require('../../stores/NotificationStore');

var {
  View,
  StyleSheet,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 12,
    paddingTop: 3
  }
});

var NotificationIcon = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired
  },

  mixins: [
    Unicycle.listenTo(notificationStore)
  ],

  render: function() {
    var notificationCallout;

    if (notificationStore.getUnreadNotifications()) {
      notificationCallout = (
        <View style={styles.unReadNotificationCalloutContainer}>
          <NotificationCallout label={numUnreadNotifications}/>
        </View>
      );
    }

    return (
      <View>
        <TouchableHighlight
          onPress={()=>{
            notificationStore.resetNumUnreadNotifications();
            this.props.navigator.push({
              component: NotificationsPopup
            });
          }}
          style={styles.container}
          underlayColor='transparent'>
          <Icon
            name='android-notifications-none'
            size={22}
            color='white'/>
        </TouchableHighlight>
        {notificationCallout}
      </View>
    );
  }

});

module.exports = NotificationIcon;
