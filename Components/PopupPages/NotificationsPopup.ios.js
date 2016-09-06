'use strict';

var React = require('react');
var ReactNative = require('react-native');

var YouniHeader = require('../Common/YouniHeader');
var BackArrow = require('../Common/BackArrow');
var NotificationsList = require('../Notification/NotificationsList');

var Colors = require('../../Utils/Common/Colors');
var IosStatusBarStyles = require('../../Utils/Common/IosStatusBarStyles');
var statusBarStyleStore = require('../../stores/StatusBarStyleStore');

var {
  View,
  Text,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  pageHeader: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center'
  }
});

var NotificationsPopup = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired
  },

  componentDidMount: function() {
    statusBarStyleStore.setStyle(IosStatusBarStyles.DEFAULT);
  },

  render: function () {
    return (
      <View style={styles.container}>

        <YouniHeader>
          <Text style={[styles.pageHeader, { color: Colors.getPrimaryAppColor() }]}>
            Notifications
          </Text>
          <BackArrow onPress={() => {
            this.props.navigator.pop();
            statusBarStyleStore.setStyle(IosStatusBarStyles.LIGHT_CONTENT);
          }}/>
        </YouniHeader>

        <NotificationsList navigator={this.props.navigator}/>

      </View>
    );
  }

});

module.exports = NotificationsPopup;
