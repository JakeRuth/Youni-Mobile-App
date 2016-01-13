'use strict'

var React = require('react-native');

var {
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  headingWrapper: {
    height: 55,
    padding: 16,
    backgroundColor: '#1599ED'
  },
  header: {
    paddingTop: 10,
    fontSize: 17,
    fontWeight: '500',
    textAlign: 'center',
    color: 'white'
  }
});

var MainScreenBanner = React.createClass({

  propTypes: {
    title: React.PropTypes.string.isRequired
  },

  render: function() {
    return (
      <View style={styles.headingWrapper}>
        <Text style={styles.header}>
          {this.props.title}
        </Text>
      </View>
    );
  }

});

module.exports = MainScreenBanner;
