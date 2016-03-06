'use strict';

var React = require('react-native');
var loginStore = require('../../stores/LoginStore');
var signUpStore = require('../../stores/signUp/SignupStore');
var Unicycle = require('../../Unicycle');
var RadioButtons = require('../Common/RadioButtons');
var Spinner = require('../Common/Spinner');
var EULAAgreementPage = require('./EULAAgreementPage');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');

var {
  View,
  Text,
  TextInput,
  StyleSheet,
  AlertIOS,
  ScrollView,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  signUpFormContainer: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    marginTop: 150
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
    borderRadius: 5
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
  hackyIosKeyPadBump: {
    marginTop: 350
  },
  eulaLink: {
    color: 'white',
    fontSize: 15,
    marginTop: 20,
    alignSelf: 'flex-start'
  },
  spinnerContainer: {
    paddingTop: 200
  }
});

var SignUpForm = React.createClass({

  propType: {
    navigator: React.PropTypes.object.isRequired
  },

  mixins: [
    Unicycle.listenTo(signUpStore)
  ],

  getInitialState: function() {
    return {
      requestInFlight: false,
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      sex: ''
    }
  },

  render: function() {
    var content;

    if (this.state.requestInFlight) {
      content = (
        <View style={styles.spinnerContainer}>
          <Spinner/>
        </View>
      );
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

        <TextInput style={styles.signUpInput}
          value={this.state.firstName}
          placeholderTextColor={'grey'}
          placeholder={'First Name'}
          onChangeText={(text) => this.setState({firstName: text})}/>

        <TextInput style={styles.signUpInput}
          value={this.state.lastName}
          placeholderTextColor={'grey'}
          placeholder={'Last Name'}
          onChangeText={(text) => this.setState({lastName: text})}/>

        <TextInput style={styles.signUpInput}
          value={this.state.email}
          placeholderTextColor={'grey'}
          placeholder={'email@college.edu'}
          onChangeText={(text) => this.setState({email: text})}/>

        <TextInput style={styles.signUpInput}
          secureTextEntry={true}
          value={this.state.password}
          clearTextOnFocus={true}
          placeholderTextColor={'grey'}
          placeholder={'Password'}
          onChangeText={(text) => this.setState({password: text})}/>

        <TextInput style={styles.signUpInput}
          secureTextEntry={true}
          value={this.state.confirmPassword}
          clearTextOnFocus={true}
          placeholderTextColor={'grey'}
          placeholder={'Confirm Password'}
          onChangeText={(text) => this.setState({confirmPassword: text})}/>

        <View style={styles.maleFemaleInputContainer}>
          <RadioButtons
            labels={['male', 'female']}
            customOnButtonPress={(label) => {this.setState({sex: label});}}/>
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

        <Text
          style={styles.eulaLink}
          onPress={() => {
            this.props.navigator.push({
              component: EULAAgreementPage
            });
          }}>
          View the EULA Agreement
        </Text>

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
      this._alertForTheEULABecauseFUCK_APPLE_INC();
    }
  },

  _onSignUpPress: function() {
    var that = this,
        isFemale = null;

    if (this.state.sex === 'female') {
      isFemale = true;
    }
    else if (this.state.sex === 'male') {
      isFemale = false;
    }
    this.setState({
      requestInFlight: true
    });

    AjaxUtils.ajax(
      '/user/create',
      {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        password: this.state.password,
        isFemale: isFemale,
        schoolName: 'SUNY Albany' //TODO fix me
      },
      (res) => {
        that.setState({
          requestInFlight: false
        });

        if (res.body.addedToWaitList) {
          that._alertAddedToWaitlist(res.body.message);
        }
        else if (res.body.emailAlreadyInUse) {
          that._alertEmailAlreadyInUse(res.body.message);
        }
        else if (res.body.success) {
          that._alertOnSuccessfulSignUp(res.body.message);
        }
        else {
          that._alertSignUpError();
        }
      },
      () => {
        that.setState({
          requestInFlight: false
        });
        that._alertSignUpError();
      }
    );
  },

  _assertAllFieldsAreNotBlank: function() {
    var firstName = this.state.firstName,
        lastName = this.state.lastName,
        email = this.state.email,
        password = this.state.password,
        confirmPassword = this.state.confirmPassword;
        //sex = this.state.sex; Cannot ask for this yet because Apple won't let us.  That's not a joke.

    return (
      firstName.length === 0 ||
      lastName.length === 0 ||
      email.length === 0 ||
      password.length === 0 ||
      confirmPassword.length === 0 //||
      //sex === null
    )
  },

  _emailMustEndInEdu: function() {
    return this.state.email.endsWith('.edu');
  },

  _doPasswordsMatch: function() {
    return this.state.password === this.state.confirmPassword;
  },

  _goToLoginPage: function() {
    Unicycle.exec('setInSignUpView', false);
  },

  _alertMissingField: function() {
    AlertIOS.alert(
      'All fields must be filled, except gender.',
      '',
      [
        {
          text: 'Ok'
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
          text: 'Ok'
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
          text: 'Ok'
        }
      ]
    );
  },

  _alertOnSuccessfulSignUp: function(message) {
    AlertIOS.alert(
      'Confirmation email sent.',
      message,
      [
        {
          text: 'Ok'
        }
      ]
    );
  },

  _alertEmailAlreadyInUse: function(message) {
    AlertIOS.alert(
      'Email already in use.',
      message,
      [
        {
          text: 'Ok'
        }
      ]
    );
  },

  _alertAddedToWaitlist: function(message) {
    AlertIOS.alert(
      'Coming soon!',
      message,
      [
        {
          text: 'Ok'
        }
      ]
    );
  },

  _alertSignUpError: function() {
    AlertIOS.alert(
      'Oops! An unexpected error occurred.',
      'Please contact support@youniapp.com with your sign up information and we can help you.',
      [
        {
          text: 'Ok'
        }
      ]
    );
  },

  _alertForTheEULABecauseFUCK_APPLE_INC: function() {
    AlertIOS.alert(
      'By signing up, you agree to our Youni Terms',
      'To view, click the link at the bottom of the page',
      [
        {
          text: 'I disagree'
        },
        {
          text: 'I agree',
          onPress: () => {
            this._onSignUpPress();
          }
        }
      ]
    );
  }

});

module.exports = SignUpForm;
