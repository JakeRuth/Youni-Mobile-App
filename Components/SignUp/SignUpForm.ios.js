'use strict';

var React = require('react-native');
var loginStore = require('../../stores/LoginStore');
var signUpStore = require('../../stores/signUp/SignupStore');
var Unicycle = require('../../Unicycle');
var RadioButtons = require('../Common/RadioButtons');

var {
  View,
  Text,
  TextInput,
  StyleSheet,
  AlertIOS,
  ScrollView,
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
  maleFemaleInputContainer: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 250,
    padding: 5,
    color: 'white',
    borderRadius: 5,
    textAlign: 'center'
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
    marginTop: 100,
    backgroundColor: 'transparent'
  },
  hackyIosKeyPadBump: {
    marginTop: 350
  }
});

var SignUpForm = React.createClass({

  mixins: [
    Unicycle.listenTo(signUpStore)
  ],

  render: function() {
    var content,
        isSignUpInFlight = signUpStore.isSignUpRequestUpInFlight(),
        signUpRequestSuccessful = signUpStore.getSignUpRequestSuccessful(),
        anyErrorsLoadingPage = signUpStore.anyErrorsLoadingPage();

    if (signUpRequestSuccessful) {
      this._alertOnSuccessfulSignUp();
    }
    else if (anyErrorsLoadingPage) {
      this._alertSignUpError();
      signUpStore.setPageLoadError(false);
    }

    if (isSignUpInFlight) {
      content = this.renderLoadingSpinner();
    }
    else {
      content = this.renderSignUpForm();
    }

    return (
      <ScrollView>
        {content}
        <View style={styles.hackyIosKeyPadBump}/>
      </ScrollView>
    );
  },

  renderSignUpForm: function() {
    return (
      <View style={styles.signUpFormContainer}>

        <Text style={styles.appName}>Youni</Text>
        <TextInput style={styles.signUpInput}
          value={signUpStore.getSignupFirstName()}
          placeholderTextColor={'grey'}
          placeholder={'First Name'}
          onChangeText={(text) => Unicycle.exec('signUpUpdateFirstName', text)}/>
        <TextInput style={styles.signUpInput}
          value={signUpStore.getSignupLastName()}
          placeholderTextColor={'grey'}
          placeholder={'Last Name'}
          onChangeText={(text) => Unicycle.exec('signUpUpdateLastName', text)}/>
        <TextInput style={styles.signUpInput}
          value={signUpStore.getSignupEmail()}
          placeholderTextColor={'grey'}
          placeholder={'email@college.edu'}
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
          value={signUpStore.getSignupConfirmPassword()}
          clearTextOnFocus={true}
          placeholderTextColor={'grey'}
          placeholder={'Confirm Password'}
          onChangeText={(text) => Unicycle.exec('signUpUpdateConfirmPassword', text)}/>
        <View style={styles.maleFemaleInputContainer}>
          <RadioButtons
            labels={['male', 'female']}
            customOnButtonPress={(label) => {Unicycle.exec('signUpUpdateSex', label);}}/>
        </View>

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
    if (this._assertAllFieldsAreNotBlank()) {
      this._alertMissingField();
    }
    else if (!this._emailMustEndInEdu()) {
      this._alertEmailIsUnexpected();
    }
    else if (!this._doPasswordsMatch()) {
      this._alertPasswordMismatch();
    }
    else {
      Unicycle.exec('onSignUpRequest');
    }
  },

  _assertAllFieldsAreNotBlank: function() {
    var firstName = signUpStore.getSignupFirstName(),
        lastName = signUpStore.getSignupLastName(),
        email = signUpStore.getSignupEmail(),
        password = signUpStore.getSignupPassword(),
        confirmPassword = signUpStore.getSignupConfirmPassword(),
        sex = signUpStore.getSex();

    return (
      firstName.length === 0 ||
      lastName.length === 0 ||
      email.length === 0 ||
      password.length === 0 ||
      confirmPassword.length === 0 ||
      sex === null
    )
  },

  _emailMustEndInEdu: function() {
    return signUpStore.getSignupEmail().endsWith('.edu');
  },

  _doPasswordsMatch: function() {
    var password = signUpStore.getSignupPassword(),
        confirmPassword = signUpStore.getSignupConfirmPassword();

    return password === confirmPassword;
  },

  _goToLoginPage: function() {
    Unicycle.exec('setInSignUpView', false);
  },

  _alertMissingField: function() {
    AlertIOS.alert(
      'All fields must be filled.',
      '',
      [
        {
          text: 'Got it'
        }
      ]
    );
  },

  _alertPasswordMismatch: function() {
    AlertIOS.alert(
      'Ooops',
      'Passwords must be the same!',
      [
        {
          text: 'Got it'
        }
      ]
    );
  },

  _alertEmailIsUnexpected: function() {
    AlertIOS.alert(
      'Unexpected email format.',
      'Must end with .edu',
      [
        {
          text: 'Got it'
        }
      ]
    );
  },

  _alertOnSuccessfulSignUp: function() {
    AlertIOS.alert(
      'Confirmation Email Sent!',
      '',
      [
        {
          text: 'Got it',
          onPress: () => { Unicycle.exec('setSignUpRequestSuccessful', false) }
        }
      ]
    );
  },

  _alertSignUpError: function() {
    AlertIOS.alert(
      'Thanks for joining the Youni Wait List! We’ll reach out to you when we open at your school!.',
      '',
      [
        {
          text: 'Try Again',
          onPress: () => { this.onSignUpButtonPress(); }
        },
        {
          text: 'Ok'
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
