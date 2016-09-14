'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Icon = require('react-native-vector-icons/MaterialIcons');

var Colors = require('../../Utils/Common/Colors');

var {
  View,
  Image,
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
  },
  image: {
    height: 15,
    width: 15
  }
});

var NavButton = React.createClass({

  propTypes: {
    onPress: React.PropTypes.func.isRequired,
    iconName: React.PropTypes.string,
    showYouniU: React.PropTypes.string
  },

  render: function() {
    return (
      <TouchableHighlight
        style={[styles.container, { backgroundColor: Colors.getPrimaryAppColor() }]}
        underlayColor={Colors.getPrimaryAppColor()}
        onPress={this.props.onPress}>
        {this._renderIcon()}
      </TouchableHighlight>
    );
  },

  _renderIcon: function() {
    if (this.props.iconName) {
      return (
        <Icon
          name={this.props.iconName}
          size={18}
          color='white'/>
      );
    }
    else if (this.props.showYouniU) {
      return (
        <Image
          style={styles.image}
          resizeMode="contain"
          source={require("../../images/homeNavIcon.png")}/>
      );
    }
    else {
      return (
        <View/>
      );
    }
  }

});

module.exports = NavButton;
