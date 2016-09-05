'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Colors = require('../Utils/Common/Colors');

var {
  View,
  Text,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  noPostsTitle: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '200',
    color: Colors.DARK_GRAY,
    paddingBottom: 12
  },
  noPostSubTitle: {
    textAlign: 'center',
    fontSize: 14,
    color: Colors.MED_GRAY,
    paddingBottom: 10
  }
});

var NoHomeFeedPostsMessage = React.createClass({

  render: function() {
    return (
      <View style={styles.container}>

        <Text style={styles.noPostsTitle}>
          No posts from anyone you're following!
        </Text>
        <Text style={styles.noPostSubTitle}>
          Find friends to follow from the Campus page
        </Text>

      </View>
    );
  }

});

module.exports = NoHomeFeedPostsMessage;
