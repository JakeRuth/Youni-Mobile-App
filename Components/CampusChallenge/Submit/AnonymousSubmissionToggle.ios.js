'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Icon = require('react-native-vector-icons/MaterialIcons');

var Colors = require('../../../Utils/Common/Colors');

var {
  View,
  Text,
  Switch,
  AlertIOS,
  StyleSheet,
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50
  },
  label: {
    flex: 1,
    color: Colors.DARK_GRAY,
    fontSize: 16,
    textAlign: 'left'
  },
  icon: {
    width: 20,
    height: 20,
    marginTop: 4,
    marginLeft: 2
  }
});

var AnonymousSubmissionToggle = React.createClass({

  propTypes: {
    submitAnonymously: React.PropTypes.bool,
    onValueChange: React.PropTypes.func.isRequired
  },

  render: function () {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>
          Submit Anonymously
          <View style={styles.icon}>
            <Icon
              onPress={this._onAnonymousInfoPress}
              name='info'
              size={20}
              color={Colors.MED_GRAY}/>
          </View>
        </Text>

        <Switch
          onTintColor={Colors.getPrimaryAppColor()}
          value={this.props.submitAnonymously}
          onValueChange={this.props.onValueChange}/>
      </View>
    );
  },

  _onAnonymousInfoPress: function() {
    AlertIOS.alert(
      'Shhhh... no one will know',
      "Switch 'Submit Anonymously' on and other users will not be able to see that you created this submission.",
      [
        {
          text: 'Cool!'
        }
      ]
    );
  }

});

module.exports = AnonymousSubmissionToggle;
