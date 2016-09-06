'use strict';

var React = require('react');
var ReactNative = require('react-native');

var Colors = require('../../Utils/Common/Colors');

var {
  View,
  Text,
  Switch,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: Colors.DARK_GRAY
  }
});

var SwitchWithLabel = React.createClass({

  propTypes: {
    label: React.PropTypes.string.isRequired,
    onValueChange: React.PropTypes.func.isRequired,
    value: React.PropTypes.bool.isRequired
  },

  render: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>
          {this.props.label}
        </Text>

        <Switch {...this.props}/>
      </View>
    );
  }

});

module.exports = SwitchWithLabel;
