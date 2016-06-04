var React = require('react-native');
var Unicycle = require('../../../Unicycle');
var loginSignupStore = require('../../../stores/LoginSignupStore');
var PrettyTouchable = require('../../Common/PrettyTouchable');
var PrettyInput = require('../../Common/PrettyInput');

var {
  View,
  Text,
  StyleSheet,
  Dimensions
} = React;

var styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    width: Dimensions.get('window').width
  },
  emailInputContainer: {
    marginBottom: 20
  },
  passwordInputContainer: {
    marginBottom: 20
  }
});

var LoginForm = React.createClass({

  render: function() {
    return (
      <View style={styles.container}>

        <View style={styles.emailInputContainer}>
          <PrettyInput
            style={{
              width: Dimensions.get('window').width * .8,
              height: 44
            }}
            onTextChange={(email) => {
              loginSignupStore.setEmail(email);
            }}
            placeholder='email@college.edu'
            keyboardType='email-address'/>
        </View>
        <View style={styles.passwordInputContainer}>
          <PrettyInput
            style={{
              width: Dimensions.get('window').width * .8,
              height: 44
            }}
            onTextChange={(password) => {
              loginSignupStore.setPassword(password);
            }}
            secureTextEntry={true}
            clearTextOnFocus={true}
            placeholder='Password'/>
        </View>

      </View>
    );
  }

});

module.exports = LoginForm;
