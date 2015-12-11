'use strict';

var React = require('react-native');
var loginStore = require('../../stores/LoginStore');
var signupStore = require('../../stores/SignupStore');
var Unicycle = require('../../Unicycle');
var request = require('superagent');
var prefix = require('superagent-prefix')('http://greedyapi.elasticbeanstalk.com');

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
  signUpFormHolder: {
    backgroundColor: 'transparent',
    alignItems: 'center'
  },
  appName: {
    marginTop: 0,
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
  loginOptionDescriptionText: {
    color: 'white',
    fontSize: 20,
    marginTop: 50
  },
  loginOptionButtonText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#237A72'
  },
  spinner: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0)'
  }
});

var SignUpForm = React.createClass({

  mixins: [
    Unicycle.listenTo(signupStore),
    Unicycle.listenTo(loginStore)
  ],

  render: function() {

    var content,
    isSignUpInFlight = signupStore.isSignupInFlight();

    if(isSignUpInFlight){
      content = this.renderLoadingSpinner();
    }

    return (
      <View style={styles.signUpFormHolder}>
        <Text style={styles.appName}>Youni</Text>
        <TextInput style={styles.signUpInput}
          value={signupStore.getSignupFirstName()}
          clearTextOnFocus={true}
          onChangeText={(text) => Unicycle.exec('signupUpdateFirstName', text)}/>
        <TextInput style={styles.signUpInput}
          value={signupStore.getSignupLastName()}
          clearTextOnFocus={true}
          onChangeText={(text) => Unicycle.exec('signupUpdateLastName', text)}/>
        <TextInput style={styles.signUpInput}
          value={signupStore.getSignupEmail()}
          clearTextOnFocus={true}
          onChangeText={(text) => Unicycle.exec('signupUpdateEmail', text)}/>
        <TextInput style={styles.signUpInput}
          secureTextEntry={true}
          value={signupStore.getSignupPassword()}
          clearTextOnFocus={true}
          placeholderTextColor={'grey'}
          placeholder={'Password'}
          onChangeText={(text) => Unicycle.exec('signupUpdatePassword', text)}/>
        <TextInput style={styles.signUpInput}
          secureTextEntry={true}
          clearTextOnFocus={true}
          placeholderTextColor={'grey'}
          placeholder={'Confirm Password'}
          onChangeText={(text) => Unicycle.exec('signupUpdateConfirmPassword', text)}/>

        <TouchableHighlight style={styles.signUpButton} underlayColor='transparent'>
          <Text style={styles.signUpText} onPress={this.onsignUpButtonPress}>Sign Up</Text>
        </TouchableHighlight>

        {content}

        <Text style={styles.loginOptionDescriptionText}>Already have an account?</Text>
        <TouchableHighlight>
          <Text style={styles.loginOptionButtonText} onPress={this._goToLoginPage}>Sign In</Text>
        </TouchableHighlight>

      </View>
    );
  },

  onsignUpButtonPress: function(){

    if(this._checkIfPasswordsMatch()){
      this._onSignupRequest();
    }
    else {
        this._alertOnFailure('Ooops', 'Passwords must be the same!', 'Okay');
    }

  },

  _checkIfPasswordsMatch: function() {
    var password = signupStore.getSignupPassword(),
        confirmPassword = signupStore.getSignupConfirmPassword();

    if (password == confirmPassword) {
      return true;
    }
    else {
      return false;
    }
  },

  _goToLoginPage: function(){
    Unicycle.exec('setInLoginView', true);
    Unicycle.exec('setInSignUpView', false);
  },


  _alertOnFailure: function(alertBoxTitle, alertBoxMessage, alertBoxButtonText) {
    Unicycle.exec('setSignupInFlight', false);
    AlertIOS.alert(alertBoxTitle, alertBoxMessage, [
      {
        text: alertBoxButtonText
      }
    ])
  },

  _alertOnSuccessfulSignUp: function(alertBoxTitle, alertBoxMessage, alertBoxButtonText) {
    AlertIOS.alert(alertBoxTitle, alertBoxMessage, [
      {
        text: alertBoxButtonText
      }
    ])
  },

  renderLoadingSpinner: function() {
    return (
      <View style={styles.spinnerContainer}>
        <ActivityIndicatorIOS
          size="small"
          color="black"
          animating={true}
          style={styles.spinner} />
      </View>
    );
  },


  _onSignupRequest: function() {
    var that = this,
        firstName = signupStore.getSignupFirstName(),
        lastName = signupStore.getSignupLastName(),
        email = signupStore.getSignupEmail(),
        password = signupStore.getSignupPassword(),
        schoolName = 'SUNY Albany';

    //fixes weird bug where blank password field validates (cannot replicate at command line with api)
    if (!password) {
      password = '~';
    }
    if (!email) {
      email = '~';
    }

    Unicycle.exec('setSignupInFlight', true);

    request.post('/user/create').use(prefix)
    .send({firstName: firstName,
                      lastName: lastName,
                      email: email,
                      password: password,
                      schoolName: schoolName})
    .set('Accept', 'application/json')
    .end(function(err, res) {

      if ((res !== undefined) && (res.ok)) {

        that._alertOnSuccessfulSignUp('Yay!', 'Confirmation Email Sent!', 'OK!');
        Unicycle.exec('setSignupInFlight', false);
        Unicycle.exec('setInLoginView', true);
        Unicycle.exec('setInSignUpView', false);
      }
      else {
      }

    });
  }

});

module.exports = SignUpForm;
