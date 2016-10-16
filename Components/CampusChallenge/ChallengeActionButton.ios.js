'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Icon = require('react-native-vector-icons/MaterialIcons');

var Colors = require('../../Utils/Common/Colors');

var {
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 4
  },
  buttonLabel: {
    color: 'white',
    fontSize: 30,
    marginRight: 15
  }
});

var ChallengeActionButton = React.createClass({

  propTypes: {
    label: React.PropTypes.string.isRequired,
    onPress: React.PropTypes.func.isRequired,
    iconName: React.PropTypes.string,
    buttonLabelStyle: React.PropTypes.number
  },

  render: function() {
    var icon;

    if (this.props.iconName) {
      icon = (
        <Icon
          name={this.props.iconName}
          size={30}
          color="white"/>
      );
    }


    return (
      <TouchableHighlight
        style={[styles.container, this.props.style]}
        underlay={Colors.getPrimaryAppColor()}
        onPress={this.props.onPress}>

        <View style={[styles.button, { backgroundColor: Colors.getPrimaryAppColor() }]}>
          <Text style={[styles.buttonLabel, this.props.buttonLabelStyle]}>
            {this.props.label}
          </Text>
          {icon}
        </View>

      </TouchableHighlight>
    );
  }

});

module.exports = ChallengeActionButton;
