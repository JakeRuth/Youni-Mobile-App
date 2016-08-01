'use strict';

var React = require('react-native');

var YouniHeader = require('../Common/YouniHeader');
var BackArrow = require('../Common/BackArrow');
var NotificationsList = require('../Notification/NotificationsList');

var Colors = require('../../Utils/Common/Colors');

var {
  View,
  Text,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  pageHeader: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    color: Colors.YOUNI_PRIMARY
  }
});

var NotificationsPopup = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired
  },

  render: function () {
    return (
      <View style={styles.container}>

        <YouniHeader>
          <Text style={styles.pageHeader}>
            Notifications
          </Text>
          <BackArrow onPress={() => {this.props.navigator.pop();}}/>
        </YouniHeader>

        <NotificationsList navigator={this.props.navigator}/>

      </View>
    );
  }

});

module.exports = NotificationsPopup;
