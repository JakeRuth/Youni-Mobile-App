'use strict';

var React = require('react-native');
var signupStore = require('../../stores/SignupStore');
var Unicycle = require('../../Unicycle');
var request = require('superagent');
var prefix = require('superagent-prefix')('http://localhost:8080/Greedy');

var {
  View,
  Text,
  TextInput,
  StyleSheet,
  AlertIOS,
  TouchableHighlight
} = React

var styles = StyleSheet.create({
  signupContentContainer: {
    backgroundColor: 'rgba(0,0,0,0)',
    flexDirection: 'column',
    alignItems: 'center'
  },
  signupInput: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    height: 30,
    width: 250,
    color: 'white',
    borderRadius: 5,
    textAlign: 'center',
    marginBottom: 8
  },
  firstInputBox: {
    marginTop: 70,
  },
  loginButton: {
    width: 120,
    height: 25,
    borderRadius: 5,
    backgroundColor: 'lightblue',
    marginTop: 40
  },
  loginText: {
    textAlign: 'center',
    fontSize: 20,
    borderRadius: 5,
    backgroundColor: 'rgba(0,0,0,0)',
    fontWeight: 'bold'
  },
  appName: {
    marginTop: 0,
    fontSize: 100,
    color: 'white',
    fontWeight: '300',
    fontFamily: 'GeezaPro'
  },
  signupButton: {
    width: 120,
    height: 25,
    borderRadius: 5,
    backgroundColor: 'lightblue',
    marginTop: 40
  },
  signupText: {
    textAlign: 'center',
    fontSize: 20,
    borderRadius: 5,
    backgroundColor: 'rgba(0,0,0,0)',
    fontWeight: 'bold'
  },
  signInOptionDescText: {
    fontSize: 20,
    marginTop: 50
  },
  loginOptionText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#237A72'
  }
});

var SignUpForm = React.createClass({

  propTypes: {
  },

  render: function() {
    return (
      <View style={styles.signupContentContainer}>
        <Text style={styles.appName}>Youni</Text>
        <TextInput style={[styles.signupInput, styles.firstInputBox]}
           value={signupStore.getSignupFirstName()}
           clearTextOnFocus={true}
           onChangeText={(text) => Unicycle.exec('signupUpdateFirstName', text)}
        />
        <TextInput style={styles.signupInput}
           value={signupStore.getSignupLastName()}
           clearTextOnFocus={true}
           onChangeText={(text) => Unicycle.exec('signupUpdateLastName', text)}
        />
        <TextInput style={styles.signupInput}
           value={signupStore.getSignupEmail()}
           clearTextOnFocus={true}
           onChangeText={(text) => Unicycle.exec('signupUpdateEmail', text)}
        />
        <TextInput style={styles.signupInput}
          secureTextEntry={true}
           value={signupStore.getSignupPassword()}
           clearTextOnFocus={true}
           placeholderTextColor={'grey'}
           placeholder={'Password'}
           onChangeText={(text) => Unicycle.exec('signupUpdatePassword', text)}
        />
        <TextInput style={styles.signupInput}
          secureTextEntry={true}
           clearTextOnFocus={true}
           placeholderTextColor={'grey'}
           placeholder={'Confirm Password'}
        />


        <TouchableHighlight style={styles.signupButton} underlayColor='white'>
           <Text style={styles.signupText} onPress={this._onSignupRequest}>Sign Up</Text>
        </TouchableHighlight>

        <Text style={styles.signInOptionDescText}>Already have an account?</Text><TouchableHighlight><Text style={styles.loginOptionText}>Sign In</Text></TouchableHighlight>

      </View>
    );
  },

  _onSignupRequest: function() {
    var that = this;
    var firstName = signupStore.getSignupFirstName();
    var lastName = signupStore.getSignupLastName();
    var email = signupStore.getSignupEmail();
    var password = signupStore.getSignupPassword();
    var schoolName = 'SUNY Albany';

    //fixes weird bug where blank password field validates (cannot replicate at command line with api)
    if (!password) {
      password = '~';
    }
    if (!email) {
      email = '~';
    }

    Unicycle.exec('setSignupRequestInFlight', true);

//firstName, lastName, email, password, schoolName

    console.log('PASSWORD:  ' + password);

    request
     .post('/user/create')
     .use(prefix)
     .send({ firstName: firstName, lastName: lastName, email: email, password: password, schoolName: schoolName })
     .set('Accept', 'application/json')
     .end(function(err, res) {

       if ((res !== undefined) && (res.ok)) {
         Unicycle.exec('setSignupRequestInFlight', false);

         console.log('something good');
       }
       else{
         console.log('signup failed');
       }



     });
  }


});

module.exports = SignUpForm;
