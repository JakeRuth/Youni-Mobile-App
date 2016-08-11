'use strict';

var React = require('react');
var ReactNative = require('react-native');

var {
  View,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    height: 64,
    paddingTop: 28
  }
});

var YouniHeader = React.createClass({

  propTypes: {
    color: React.PropTypes.string
  },
  
  getDefaultProps: function() {
    return {
      color: 'white'
    }
  },

  render: function() {
    return (
      <View style={[styles.container, {backgroundColor: this.props.color}, this.props.style]}>
        {this.props.children ? this.props.children : <View/>}
      </View>
    );
  }

});

module.exports = YouniHeader;
