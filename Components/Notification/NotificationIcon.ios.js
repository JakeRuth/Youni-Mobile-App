'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Icon = require('react-native-vector-icons/MaterialIcons');
var Unicycle = require('../../Unicycle');
var NotificationCallout = require('./NotificationCallout');
var NotificationsPopup = require('../PopupPages/NotificationsPopup');
var notificationStore = require('../../stores/NotificationStore');

var {
  View,
  StyleSheet,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  callout: {
    position: 'absolute',
    top: 2,
    right: 2
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
        <NotificationCallout style={styles.callout}/>
      );
    }

    return (
      <View style={this.props.style}>
        <View style={{position: 'relative'}}>
          <TouchableHighlight
            onPress={()=>{
              notificationStore.resetNumUnreadNotifications();
              this.props.navigator.push({
                component: NotificationsPopup
              });
            }}
            underlayColor='transparent'>
            <Icon
              name='notifications-none'
              size={30}
              color='white'/>
          </TouchableHighlight>
          {notificationCallout}
        </View>
      </View>
    );
  }

});

module.exports = NotificationIcon;
