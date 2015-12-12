'use strict';

var React = require('react-native');
var loginStore = require('../../stores/LoginStore');
var signUpStore = require('../../stores/signUp/SignupStore');
var Unicycle = require('../../Unicycle');

var {
  View,
  Text,
  TextInput,
  StyleSheet,
  AlertIOS,
  ActivityIndicatorIOS,
  TouchableHighlight
} = React

var styles = StyleSheet.create({
  signUpFormContainer: {
    backgroundColor: 'transparent',
    alignItems: 'center'
  },
  appName: {
    fontSize: 100,
    color: 'white',
    fontWeight: '300',
    fontFamily: 'GeezaPro',
    marginBottom: 70
  },
  signUpInput: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    height: 30,
    width: 250,
    color: 'white',
    borderRadius: 5,
    textAlign: 'center',
    marginBottom: 8
  },
  signUpText: {
    textAlign: 'center',
    fontSize: 20,
    borderRadius: 5,
    backgroundColor: 'transparent',
    fontWeight: 'bold'
  },
  signUpButton: {
    flex: 1,
    width: 100,
    borderRadius: 5,
    backgroundColor: 'lightblue',
    marginTop: 40
  },
  loginPageLink: {
    marginTop: 50
  },
  loginPageLinkText: {
    alignSelf: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20
  },
  spinner: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0)'
  }
});

var SignUpForm = React.createClass({

  mixins: [
    Unicycle.listenTo(signUpStore)
  ],

  render: function() {
    var content,
        isSignUpInFlight = signUpStore.isSignUpRequestUpInFlight(),
        signUpRequestSuccessful = signUpStore.getSignUpRequestSuccessful();

    if (signUpRequestSuccessful) {
      this._alertOnSuccessfulSignUp();
    }

    if (isSignUpInFlight) {
      content = this.renderLoadingSpinner();
    }
    else {
      content = this.renderSignUpForm();
    }

    return (
      <View>
        {content}
      </View>
    );
  },

  renderSignUpForm: function() {
    return (
      <View style={styles.signUpFormContainer}>

        <Text style={styles.appName}>Youni</Text>
        <TextInput style={styles.signUpInput}
          value={signUpStore.getSignupFirstName()}
          clearTextOnFocus={true}
          onChangeText={(text) => Unicycle.exec('signUpUpdateFirstName', text)}/>
        <TextInput style={styles.signUpInput}
          value={signUpStore.getSignupLastName()}
          clearTextOnFocus={true}
          onChangeText={(text) => Unicycle.exec('signUpUpdateLastName', text)}/>
        <TextInput style={styles.signUpInput}
          value={signUpStore.getSignupEmail()}
          clearTextOnFocus={true}
          onChangeText={(text) => Unicycle.exec('signUpUpdateEmail', text)}/>
        <TextInput style={styles.signUpInput}
          secureTextEntry={true}
          value={signUpStore.getSignupPassword()}
          clearTextOnFocus={true}
          placeholderTextColor={'grey'}
          placeholder={'Password'}
          onChangeText={(text) => Unicycle.exec('signUpUpdatePassword', text)}/>
        <TextInput style={styles.signUpInput}
          secureTextEntry={true}
          clearTextOnFocus={true}
          placeholderTextColor={'grey'}
          placeholder={'Confirm Password'}
          onChangeText={(text) => Unicycle.exec('signUpUpdateConfirmPassword', text)}/>

        <TouchableHighlight
          style={styles.signUpButton}
          underlayColor='transparent'
          onPress={this.onSignUpButtonPress}>
          <Text style={styles.signUpText}>Sign Up</Text>
        </TouchableHighlight>

        <TouchableHighlight style={styles.loginPageLink} onPress={this._goToLoginPage}>
          <View>
            <Text style={styles.loginPageLinkText}>Already have an account?</Text>
            <Text style={styles.loginPageLinkText}>Sign In</Text>
          </View>
        </TouchableHighlight>

      </View>
    );
  },

  onSignUpButtonPress: function() {
    if (this._checkIfPasswordsMatch()) {
      Unicycle.exec('onSignUpRequest');
    }
    else {
      this._alertPasswordMismatch();
    }
  },

  _checkIfPasswordsMatch: function() {
    var password = signUpStore.getSignupPassword(),
        confirmPassword = signUpStore.getSignupConfirmPassword();

    return password == confirmPassword;
  },

  _goToLoginPage: function() {
    Unicycle.exec('setInSignUpView', false);
  },


  _alertPasswordMismatch: function() {
    Unicycle.exec('setSignUpInFlight', false);
    AlertIOS.alert(
      'Ooops',
      'Passwords must be the same!',
      [
        {
          text: 'Okay'
        }
      ]
    );
  },

  _alertOnSuccessfulSignUp: function() {
    AlertIOS.alert(
      'Yay!',
      'Confirmation Email Sent!',
      [
        {
          text: 'OK!'
        }
      ]
    );
  },

  renderLoadingSpinner: function() {
    return (
      <View style={styles.spinnerContainer}>
        <ActivityIndicatorIOS
          size="large"
          color="white"
          animating={true}
          style={styles.spinner} />
      </View>
    );
  }

});

module.exports = SignUpForm;
