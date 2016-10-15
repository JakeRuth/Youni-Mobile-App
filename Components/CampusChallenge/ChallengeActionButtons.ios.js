'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Icon = require('react-native-vector-icons/MaterialIcons');

var SubmitCampusChallengePopup = require('../PopupPages/SubmitCampusChallengePopup');

var Colors = require('../../Utils/Common/Colors');

var {
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    maxHeight: 150
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 4
  },
  leftButton: {
    marginLeft: 5,
    marginRight: 2.5
  },
  rightButton: {
    marginRight: 5,
    marginLeft: 2.5
  },
  buttonLabel: {
    color: 'white',
    fontSize: 30,
    marginRight: 15
  }
});

var ChallengeActionButtons = React.createClass({

  propTypes: {
    campusChallenge: React.PropTypes.object.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    let onEnterChallengePress = () => {
      this.props.navigator.push({
        component: SubmitCampusChallengePopup,
        passProps: {...this.props}
      });
    };

    return (
      <View style={styles.container}>
        {this._renderButton('Enter', 'photo-camera', styles.leftButton, onEnterChallengePress)}
        {this._renderButton('Vote', 'arrow-upward', styles.rightButton)}
      </View>
    );
  },

  _renderButton: function(label, iconName, style, onPress) {
    return (
      <TouchableHighlight
        style={{flex: 1}}
        underlay={Colors.getPrimaryAppColor()}
        onPress={onPress}>

        <View style={[styles.button, style, { backgroundColor: Colors.getPrimaryAppColor() }]}>
          <Text style={styles.buttonLabel}>
            {label}
          </Text>
          <Icon
            name={iconName}
            size={30}
            color="white"/>
        </View>

      </TouchableHighlight>
    );
  }

});

module.exports = ChallengeActionButtons;
