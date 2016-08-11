var React = require('react');
var ReactNative = require('react-native');
var PrettyTouchable = require('../Common/PrettyTouchable');

var {
  View,
  StyleSheet,
  Dimensions
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width: Dimensions.get('window').width
  }
});

var LoginSignupSelector = React.createClass({

  propTypes: {
    onLoginPress: React.PropTypes.func.isRequired,
    onCreateAccountPress: React.PropTypes.func.isRequired
  },

  render: function() {
    var buttonWidth = Dimensions.get('window').width * .8;

    return (
      <View style={styles.container}>
        <PrettyTouchable
          label="Sign In"
          containerStyle={{
            width: buttonWidth,
            height: 44,
            marginBottom: 20
          }}
          invertColors={true}
          onPress={this.props.onLoginPress}/>
        <PrettyTouchable
          label="Create Account"
          containerStyle={{
            width: buttonWidth,
            height: 44
          }}
          onPress={this.props.onCreateAccountPress}/>
      </View>
    );
  }

});

module.exports = LoginSignupSelector;
