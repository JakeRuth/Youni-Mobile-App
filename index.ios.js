'use strict';

var React = require('react-native');
var Unicycle = require('./Unicycle');
var loginStore = require('./stores/LoginStore');
var signupStore = require('./stores/SignupStore');
var userLoginMetadataStore = require('./stores/UserLoginMetadataStore');
var landingPage = require('./LandingPage');
var request = require('superagent');
var prefix = require('superagent-prefix')('http://localhost:8080/Greedy');

var {
  View,
  Text,
  TouchableHighlight,
  AppRegistry,
  StyleSheet,
  Image,
  TextInput,
  NavigatorIOS,
  TabBarIOS,
  AlertIOS,
  AsyncStorage,
  ActivityIndicatorIOS
} = React;

var styles = StyleSheet.create({
  rootWrapper: {
    flex: 1
  },
  imageContainer: {
    flex: 1
  },
  backgroundImage: {
    flex: 1,
    width: null,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0)'
  },
  contentContainer: {
    backgroundColor: 'rgba(0,0,0,0)',
    flexDirection: 'column',
    alignItems: 'center'
  },
  appName: {
    marginTop: -100,
    fontSize: 100,
    color: 'white',
    fontWeight: '300',
    fontFamily: 'GeezaPro'
  },
  loginInput: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    height: 30,
    width: 250,
    color: 'white',
    borderRadius: 5,
    textAlign: 'center',
    marginBottom: 8
  },
  emailInput: {
    marginTop: 70
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
  spinner: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0)'
  }
});

//TODO: this should probably be broken down into smaller components
var LoginPage = React.createClass({

  mixins: [
    Unicycle.listenTo(loginStore),
    Unicycle.listenTo(signupStore),
    Unicycle.listenTo(userLoginMetadataStore)
  ],

  render: function () {
    var isLoginInFlight = loginStore.isLoginInFlight();
    var onWayToSignupInFlight = signupStore.isOnWayToSignupInFlight();

    var content;
    if (isLoginInFlight) {
      content = this.renderLoadingSpinner();
    }
    else if(onWayToSignupInFlight){
      content = this.renderSignupForm();
    }
    else {
      content = this.renderLoginForm();
    }


    return (
      <View style={styles.imageContainer}>
        <Image source={require('image!loginPageBackground2')}
               style={styles.backgroundImage}>
            { content }
        </Image>
      </View>
    );
  },

  renderLoginForm: function() {
    return (
       <View style={styles.contentContainer}>
         <Text style={styles.appName}>Youni</Text>
         <TextInput style={[styles.loginInput, styles.emailInput]}
            value={loginStore.getEmail()}
            clearTextOnFocus={true}
            onChangeText={(text) => Unicycle.exec('updateEmail', text)}
         />
         <TextInput style={styles.loginInput}
            secureTextEntry={true}
            value={loginStore.getPassword()}
            clearTextOnFocus={true}
            onChangeText={(text) => Unicycle.exec('updatePassword', text)}
         />
         <TouchableHighlight style={styles.loginButton} underlayColor='white'>
            <Text style={styles.loginText} onPress={this._onLoginRequest}>Login</Text>
         </TouchableHighlight>

         <TouchableHighlight style={styles.signupButton} underlayColor='white'>
            <Text style={styles.signupText} onPress={this._onWayToSignupRequest}>Sign Up</Text>
         </TouchableHighlight>
       </View>
    );
  },


renderSignupForm: function(){
  return(
    <View style={styles.contentContainer}>
      <Text style={styles.appName}>Youni</Text>
      <TextInput style={[styles.loginInput, styles.emailInput]}
         value={signupStore.getFirstName()}
         clearTextOnFocus={true}
         //onChangeText={(text) => Unicycle.exec('updateFirstName', text)}
      />

      <TextInput style={styles.loginInput}
         value={signupStore.getLastName()}
         clearTextOnFocus={true}
         //onChangeText={(text) => Unicycle.exec('updateLastName', text)}
      />
      <TextInput style={[styles.loginInput, styles.emailInput]}
         value={signupStore.getEmail()}
         clearTextOnFocus={true}
         onChangeText={(text) => Unicycle.exec('updateEmail', text)}
      />
      <TextInput style={styles.loginInput}
         secureTextEntry={true}
         value={signupStore.getPassword()}
         clearTextOnFocus={true}
         onChangeText={(text) => Unicycle.exec('updatePassword', text)}
      />


      <TouchableHighlight style={styles.signupButton} underlayColor='white'>
         <Text style={styles.signupText}>Sign Up</Text>
      </TouchableHighlight>

      <Text>or</Text>
      <TouchableHighlight style={styles.loginButton} underlayColor='white'>
         <Text style={styles.loginText}>Login</Text>
      </TouchableHighlight>

    </View>
  );
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



  _onWayToSignupRequest: function(){
        Unicycle.exec('setOnWayToSignupInFlight', true);
  },


  //TODO: This should probably be on the PostStore
  _onLoginRequest: function() {
    var that = this;
    var email = loginStore.getEmail();
    var password = loginStore.getPassword();

    //fixes weird bug where blank password field validates (cannot replicate at command line with api)
    if (!password) {
      password = '~';
    }
    if (!email) {
      email = '~';
    }

    Unicycle.exec('setLoginInFlight', true);

    request
     .post('/api/login')
     .use(prefix)
     .send({ username: email, password: password })
     .set('Accept', 'application/json')
     .end(function(err, res) {
       if ((res !== undefined) && (res.ok)) {
         var userId = res.body.userId,
             refreshToken = res.body.refreshToken,
             accessToken = res.body.accessToken,
             email = res.body.username;

         Unicycle.exec('setAllMetadata', accessToken, refreshToken, userId, email);
         that._saveUserId(userId);
         that._saveEmail(email);
         that._saveRefreshToken(refreshToken);
         that._saveAccessTokenThenLoadHomePage(accessToken);
       } else {
         that._alertFailedLogin();
       }
     });
  },

  //TODO: Think about a better way to interact with phone storage
  //maybe we want to use stores?  Worth revisiting...
  _saveUserId: function(userId) {
    AsyncStorage.setItem('userId', userId);
  },

  _saveEmail: function(email) {
    AsyncStorage.setItem('email', email);
  },

  _saveRefreshToken: function(refreshToken) {
    AsyncStorage.setItem('refreshToken', refreshToken);
  },

  _saveAccessTokenThenLoadHomePage: function(accessToken) {
    var that = this;
    AsyncStorage.setItem('accessToken', accessToken).then(() => {
      that.props.navigator.pop();
      that.props.navigator.push({
          component: landingPage
      });
    }).done();
  },

  _alertFailedLogin: function() {
    Unicycle.exec('setLoginInFlight', false);
    AlertIOS.alert(
     'Login Failed',
     'Invalid credentials',
     [
       {text: 'Try again noob!'}
     ]
   )
  }

});

var RootNavigator = React.createClass({

  render: function() {
    return (
      <NavigatorIOS style={styles.rootWrapper}
        navigationBarHidden={true}
        initialRoute={{
          component: LoginPage,
          title: 'Login Page'
        }}
      />
    )
  }

});


AppRegistry.registerComponent('Youni', () => RootNavigator);
