'use strict';

var React = require('react-native');

var {
  View,
  Text,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

var SignupProgressBar = React.createClass({

  getDefaultProps: function() {
    return {
      visible: true
    };
  },

  propTypes: {
    visible: React.PropTypes.bool
  },

  render: function() {
    if (!this.props.visible) {
      return <View style={styles.container}/>
    }

    return (
      <View style={styles.container}>
      <Text>placeholder yeo</Text>
      </View>
    );
  }

});

module.exports = SignupProgressBar;
