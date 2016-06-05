'use strict';

var React = require('react-native');
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
    marginTop: 60
  },
  signUpInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    height: 30,
    width: 250,
    borderRadius: 5,
    textAlign: 'center',
    fontWeight: '100',
    marginBottom: 8,
    alignSelf: 'center'
  },
  genderInputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    width: 250,
    padding: 5,
    borderRadius: 5
  },
  signUpButton: {
    flex: 1,
    width: 250,
    height: 40,
    marginTop: 25,
    borderRadius: 3,
    borderColor: 'white',
    borderWidth: 1
  },
  signUpText: {
    flex: 1,
    alignSelf: 'center',
    width: 250,
    paddingTop: 5,
    backgroundColor: 'transparent',
    color: 'white',
    textAlign: 'center',
    fontSize: 23,
    fontWeight: '300'
  },
  eulaAlert: {
    color: 'white',
    fontSize: 15,
    marginTop: 20,
    alignSelf: 'center'
  },
  eulaLink: {
    fontWeight: '500',
    marginTop: 0
  },
  spinnerContainer: {
    paddingTop: 200
  }
});

// TODO: DELETE
var SignUpForm = React.createClass({

  propType: {
    navigator: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      requestInFlight: false,
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      sex: null
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
      </ScrollView>
    );
  },

  renderSignUpForm: function() {
    return (
      <View style={styles.signUpFormContainer}>

        <TextInput
          style={styles.signUpInput}
          value={this.state.firstName}
          placeholderTextColor={'white'}
          placeholder={'First Name'}
          onChangeText={(text) => this.setState({firstName: text})}/>

        <TextInput
          style={styles.signUpInput}
          value={this.state.lastName}
          placeholderTextColor={'white'}
          placeholder={'Last Name'}
          onChangeText={(text) => this.setState({lastName: text})}/>

        <TextInput
          style={styles.signUpInput}
          value={this.state.email}
          placeholderTextColor={'white'}
          placeholder={'email@college.edu'}
          onChangeText={(text) => this.setState({email: text})}/>

        <TextInput
          style={styles.signUpInput}
          secureTextEntry={true}
          value={this.state.password}
          clearTextOnFocus={true}
          placeholderTextColor={'white'}
          placeholder={'Password'}
          onChangeText={(text) => this.setState({password: text})}/>

        <TextInput
          style={styles.signUpInput}
          secureTextEntry={true}
          value={this.state.confirmPassword}
          clearTextOnFocus={true}
          placeholderTextColor={'white'}
          placeholder={'Confirm Password'}
          onChangeText={(text) => this.setState({confirmPassword: text})}/>

        <View style={styles.genderInputContainer}>
          <RadioButtons
            labels={['male', 'female']}
            customOnButtonPress={(label) => {this.setState({sex: label});}}/>
        </View>

        <TouchableHighlight
          style={styles.signUpButton}
          underlayColor='transparent'
          onPress={this.onSignUpButtonPress}>
          <Text style={styles.signUpText}>Create Account</Text>
        </TouchableHighlight>

        <Text style={styles.eulaAlert}>
          By signing up, you agree to our
        </Text>
        <Text
          style={[styles.eulaAlert, styles.eulaLink]}
          onPress={() => {
            this.props.navigator.push({
              component: EULAAgreementPage
            });
          }}>
          Terms & Privacy Policy.
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
    else if (this.state.password.length < this.MIN_PASSWORD_LENGTH) {
      this._alertPasswordNotLongEnough();
    }
    else {
      this._createUser();
    }
  },

  _createUser: function() {
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
        confirmPassword = this.state.confirmPassword,
        sex = this.state.sex;

    return (
      firstName.length === 0 ||
      lastName.length === 0 ||
      email.length === 0 ||
      password.length === 0 ||
      confirmPassword.length === 0 ||
      sex === null
    );
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
      'All fields must be filled',
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
      'Oops',
      'Passwords must match',
      [
        {
          text: 'Ok'
        }
      ]
    );
  },

  _alertPasswordNotLongEnough: function() {
    AlertIOS.alert(
      'Password too short',
      'It must be at least 6 characters long',
      [
        {
          text: 'Ok'
        }
      ]
    );
  },

  _alertEmailIsUnexpected: function() {
    AlertIOS.alert(
      'Unexpected email format',
      'Emails must end with .edu',
      [
        {
          text: 'Ok'
        }
      ]
    );
  },

  _alertOnSuccessfulSignUp: function(message) {
    AlertIOS.alert(
      'Confirmation email sent',
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
      'Email already in use',
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
      'Oops! An unexpected error occurred',
      'Please contact support@youniapp.com with your sign up information and we can help you',
      [
        {
          text: 'Ok'
        }
      ]
    );
  },

  MIN_PASSWORD_LENGTH: 6

});

module.exports = SignUpForm;
