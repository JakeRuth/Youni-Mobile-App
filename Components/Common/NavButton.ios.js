'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Icon = require('react-native-vector-icons/MaterialIcons');

var Colors = require('../../Utils/Common/Colors');

var {
  TouchableHighlight,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 40,
    borderRadius: 20,
    borderColor: 'white',
    borderWidth: 1
  }
});

var NavButton = React.createClass({

  propTypes: {
    onPress: React.PropTypes.func.isRequired,
    iconName: React.PropTypes.string.isRequired
  },

  render: function() {
    return (
      <TouchableHighlight
        style={[styles.container, { backgroundColor: Colors.getPrimaryAppColor() }]}
        underlayColor={Colors.getPrimaryAppColor()}
        onPress={this.props.onPress}>
        <Icon
          name={this.props.iconName}
          size={18}
          color='white'/>
      </TouchableHighlight>
    );
  }

});

module.exports = NavButton;
