'use strict';

var React = require('react-native');

var {
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  container: {
    height: 45,
    padding: 16,
    backgroundColor: '#5C7CFF'
  },
  header: {
    paddingTop: 2,
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    color: 'white'
  }
});

var MainScreenBanner = React.createClass({

  propTypes: {
    title: React.PropTypes.string
  },

  render: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>
          {this.props.title}
        </Text>
      </View>
    );
  }

});

module.exports = MainScreenBanner;
