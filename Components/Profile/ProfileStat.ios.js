'use strict';

var React = require('react-native');
var Colors = require('../../Utils/Common/Colors');

var {
  View,
  Text,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  value: {
    fontWeight: '300',
    color: 'white',
    fontSize: 16,
    textAlign: 'center'
  },
  label: {
    fontWeight: '100',
    color: 'white',
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
