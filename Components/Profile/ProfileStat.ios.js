'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Colors = require('../../Utils/Common/Colors');

var {
  View,
  Text,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  value: {
    color: Colors.DARK_GRAY,
    fontSize: 16,
    textAlign: 'center'
  },
  label: {
    color: Colors.DARK_GRAY,
    fontSize: 12,
    textAlign: 'center'
  }
});

var ProfileStat = React.createClass({

  propTypes: {
    value: React.PropTypes.any.isRequired,
    label: React.PropTypes.string.isRequired
  },

  render: function() {
    return (
      <View>
        <Text style={styles.value}>
          {this.props.value}
        </Text>
        <Text style={styles.label}>
          {this.props.label}
        </Text>
      </View>
    );
  }

});

module.exports = ProfileStat;
