'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Unicycle = require('../../Unicycle');

var OverlayPage = require('../Common/OverlayPage');
var Spinner = require('../Common/Spinner');

var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var Color = require('../../Utils/Common/Colors');

var {
  Text,
  StyleSheet,
  View,
  TextInput,
  AlertIOS,
  Dimensions
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.get('window').height
  },
  message: {
    textAlign: 'center',
    padding: 10
  },
  emailInput: {
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    alignSelf: 'center',
    height: 30,
    width: 250,
    fontSize: 15,
    margin: 10,
    padding: 5
  },
  submitEmailForPasswordResetButton: {
    alignSelf: 'center',
    textAlign: 'center',
    margin: 20,
    width: 120,
    height: 25,
    fontSize: 20,
    color: 'white',
    borderRadius: 3
  }
});

var ForgotPasswordPage = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      isRequestInFlight: false,
      email: ''
    }
  },

  render: function() {
    var content;

    if (this.state.isRequestInFlight) {
      content = <Spinner/>;
    }
    else {
      content = this.renderContent();
    }

    return (
      <OverlayPage
        content={content}
        onBackArrowPress={() => {
          this.props.navigator.pop();
        }}
        bannerTitle='Forgot Password'
        keyboardShouldPersistTaps={true}/>
    );
  },

  renderContent: function() {
    return (
      <View style={styles.container}>

        <Text style={styles.message}>
          Enter your email.
        </Text>
        <Text style={styles.message}>
          You will receive an email from us with a one time link to change your password.
        </Text>
        <TextInput
          style={styles.emailInput}
          placeholder='email@college.edu'
          placeholderTextColor='lightgray'
          onChangeText={(text) => { this.setState({ email: text }); }}/>
        <Text
          style={[styles.submitEmailForPasswordResetButton, { backgroundColor: Color.getPrimaryAppColor() }]}
          onPress={this._onSubmitPasswordChangeRequest}>
          Submit
        </Text>

      </View>
    );
  },

  _onSubmitPasswordChangeRequest: function() {
    var that = this;

    if (this.state.email && this.state.email.endsWith('.edu')) {
      this.setState({
        isRequestInFlight: true
      });

      AjaxUtils.ajax(
        '/userSecurity/requestPasswordChange',
        {
          email: this.state.email
        },
        () => {
          that._alertSuccessfulRequest();
          that.setState({
            isRequestInFlight: false
          });
        },
        () => {
          that._alertFailedRequest();
          that.setState({
            isRequestInFlight: false
          });
        }
      )
    }
    else {
      this._alertEmailFormatError();
    }
  },

  _alertSuccessfulRequest: function() {
    AlertIOS.alert(
      'Success!',
      "Email sent to: " + this.state.email + " check your email (check your JUNK folder too) for the password reset link",
      [
        {text: 'Ok'}
      ]
    );
  },

  _alertFailedRequest: function() {
    AlertIOS.alert(
      'Oops!  A problem occurred',
      'If this persists or you think this is an error, please contact support@youniapp.com',
      [
        {text: 'Ok'}
      ]
    );
  },

  _alertEmailFormatError: function() {
    AlertIOS.alert(
      'Email format exception',
      "Looks like the email you typed in: " + this.state.email + " is either blank, or doesn't end in .edu",
      [
        {text: 'Ok'}
      ]
    );
  }

});

module.exports = ForgotPasswordPage;
