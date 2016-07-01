'use strict';

var React = require('react-native');

var {
  View,
  Text,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  redDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'red'
  }
});

var NotificationCallout = React.createClass({

  render: function() {
    return (
      <View style={[styles.redDot, this.props.style]}/>
    );
  }

});

module.exports = NotificationCallout;
