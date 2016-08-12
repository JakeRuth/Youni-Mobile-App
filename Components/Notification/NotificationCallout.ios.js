'use strict';

var React = require('react');
var ReactNative = require('react-native');

var {
  View,
  Text,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'white',
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
