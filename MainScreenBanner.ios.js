'use strict';

var React = require('react-native');
var Color = require('./Utils/Common/Colors');

var {
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  container: {
    height: 64,
    backgroundColor: Color.YOUNI_PRIMARY_PURPLE
  },
  header: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    color: 'white',
    marginTop: 24
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
