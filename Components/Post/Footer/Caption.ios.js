'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Colors = require('../../../Utils/Common/Colors');

var {
  View,
  Text,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  caption: {
    fontSize: 16,
    fontWeight: '300',
    color: Colors.DARK_GRAY,
    paddingBottom: 8
  }
});

var Caption = React.createClass({

  propTypes: {
    text: React.PropTypes.string
  },

  render: function() {
    if (!this.props.text) {
      return <View/>;
    }

    return (
      <Text style={styles.caption}>
        {this.props.text}
      </Text>
    );
  }

});

module.exports = Caption;
