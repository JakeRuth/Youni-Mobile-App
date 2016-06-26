'use strict';

var React = require('react-native');

var {
  View,
  Text,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  container: {
    width: 17,
    height: 17,
    borderRadius: 8.5,
    backgroundColor: 'red'
  },
  label: {
    textAlign: 'center',
    fontSize: 11,
    color: 'white',
    backgroundColor: 'transparent',
    fontWeight: '500',
    marginTop: 1.5
  }
});

var NotificationCallout = React.createClass({

  propTypes: {
    label: React.PropTypes.any.isRequired
  },

  render: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>
          {this.props.label}
        </Text>
      </View>
    );
  }

});

module.exports = NotificationCallout;
