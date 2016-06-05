var React = require('react-native');
var Unicycle = require('../../../Unicycle');
var loginStore = require('../../../stores/LoginStore');
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
              loginStore.setEmail(email);
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
              loginStore.setPassword(password);
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
