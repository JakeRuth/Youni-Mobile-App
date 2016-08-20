'use strict';

var React = require('react');
var ReactNative = require('react-native');
var PrettyTouchable = require('../Common/PrettyTouchable');

var {
  View,
  Text,
  StyleSheet,
  Dimensions
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 30,
    width: Dimensions.get('window').width
  },
  label: {
    textAlign: 'center',
    fontSize: 14,
    color: 'white',
    fontWeight: '100'
  },
  clickableLabel: {
    textDecorationLine: 'underline',
    paddingTop: 10,
    paddingBottom: 10
  }
});

var FlowNavigationFooter = React.createClass({

  propTypes: {
    label: React.PropTypes.string.isRequired,
    clickableLabel: React.PropTypes.string.isRequired,
    action: React.PropTypes.func.isRequired
  },

  render: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>
          {this.props.label + ' '}
          <Text
            style={styles.clickableLabel}
            onPress={this.props.action}>
            {this.props.clickableLabel}
          </Text>
        </Text>
      </View>
    );
  }

});

module.exports = FlowNavigationFooter;
