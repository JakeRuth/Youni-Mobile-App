'use strict';

var React = require('react');
var ReactNative = require('react-native');

var Colors = require('../../Utils/Common/Colors');

var {
  View,
  StyleSheet,
  ActivityIndicator
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

var Spinner = React.createClass({

  propTypes: {
    color: React.PropTypes.string
  },

  render: function() {
    return (
      <View style={[styles.container, this.props.style]}>
        <ActivityIndicator
          size={'small'}
          color={this.props.color ? this.props.color : Colors.getPrimaryAppColor()}/>
      </View>
    );
  }
});

module.exports = Spinner;
