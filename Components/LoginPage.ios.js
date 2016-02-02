'use strict';

var React = require('react-native');
var SignUpForm = require('./SignUp/SignUpForm');
var Unicycle = require('../Unicycle');
var loginStore = require('../stores/LoginStore');
var signUpStore = require('../stores/signUp/SignupStore');
var userLoginMetadataStore = require('../stores/UserLoginMetadataStore');
var globalAppPageStateStore = require('../stores/GlobalAppPageStateStore');
var AjaxUtils = require('../Utils/Common/AjaxUtils');
var PAGE_KEYS = require('../Utils/Enums/PageNameEnum');

var {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  Image,
  TextInput,
  AlertIOS,
  AsyncStorage,
  ActivityIndicatorIOS
} = React;

var styles = StyleSheet.create({
  imageContainer: {
    flex: 1
  },
  backgroundImage: {
    flex: 1,
    width: null,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    opacity: 0.9
  },
  contentContainer: {
    backgroundColor: 'transparent',
    flexDirection: 'column',
    alignItems: 'center'
  },
  signUpContentContainer: {
    flexDirection: 'column',
    alignItems: 'center'
  },
  appName: {
    marginTop: -100,
    fontSize: 100,
    color: 'white',
    fontWeight: '300',
    fontFamily: 'GeezaPro',
    marginBottom: 70
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
  loginButton: {
    width: 125,
    height: 25,
    borderRadius: 5,
    backgroundColor: 'lightblue',
    marginTop: 40
  },
  loginText: {
    textAlign: 'center',
    fontSize: 20,
    borderRadius: 5,
    backgroundColor: 'transparent',
    fontWeight: 'bold'
  },
  spinnerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  spinner: {
    flex: 1,
    backgroundColor: 'transparent',
    marginTop: 27 //used to make this spinner match up with the home page spinner
  },
  signUpOptionDescText: {
    fontSize: 20,
    color: 'white',
    marginTop: 50
  },
  signUpOptionText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#237A72'
  }
});

//TODO: this should probably be broken down into smaller components
var LoginPage = React.createClass({

  mixins: [
    Unicycle.listenTo(loginStore),
    Unicycle.listenTo(signUpStore),
    Unicycle.listenTo(userLoginMetadataStore)
  ],

  componentDidMount: function() {
    this._attemptToAutoLoginUser();
  },

  render: function () {
    var shouldRenderLoginPage = loginStore.getShouldRenderLoginPage(),
        isLoginInFlight = loginStore.isLoginInFlight(),
        isInSignUpView = signUpStore.isInSignUpView(),
        content;

    if (isLoginInFlight || !shouldRenderLoginPage) {
      content = this.renderLoadingSpinner();
    }
    else if (isInSignUpView){
      content =  (
        <Image source={{uri: 'https://images.unsplash.com/uploads/14121985124429dd8eeb5/60431f5b?dpr=2&fit=crop&fm=jpg&h=650&ixjsv=2.0.0&ixlib=rb-0.3.5&q=50&w=1300'}}
               style={styles.backgroundImage}>
          <SignUpForm/>
        </Image>
      );
    }
    else {
      content = this.renderLoginForm();
    }

    return (
      <View style={styles.imageContainer}>
        { content }
      </View>
    );
  },

  renderLoginForm: function() {
    return (
      <Image source={{uri: 'https://images.unsplash.com/uploads/14121985124429dd8eeb5/60431f5b?dpr=2&fit=crop&fm=jpg&h=650&ixjsv=2.0.0&ixlib=rb-0.3.5&q=50&w=1300'}}
             style={styles.backgroundImage}>

         <View style={styles.contentContainer}>
           <Text style={styles.appName}>Youni</Text>

           <TextInput style={styles.loginInput}
              value={loginStore.getEmail()}
              onChangeText={(text) => Unicycle.exec('updateEmail', text)}
              placeholderTextColor='grey'
              placeholder='email@college.edu'
              keyboardType='email-address'
           />
           <TextInput style={styles.loginInput}
              secureTextEntry={true}
              value={loginStore.getPassword()}
              clearTextOnFocus={true}
              placeholderTextColor='grey'
              placeholder='password'
              onChangeText={(text) => Unicycle.exec('updatePassword', text)}
           />

           <TouchableHighlight style={styles.loginButton} underlayColor='transparent'>
              <Text style={styles.loginText} onPress={this._onLoginRequest}>Login</Text>
           </TouchableHighlight>

           <Text style={styles.signUpOptionDescText}>
              Dont have Youni account?
           </Text>

           <TouchableHighlight>
             <Text style={styles.signUpOptionText} onPress={this._goToSignUpPage}>Sign Up</Text>
           </TouchableHighlight>
         </View>

     </Image>
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

  _attemptToAutoLoginUser: function() {
    AsyncStorage.multiGet(['email', 'password']).then((response) => {
      if (this._cachedUsernameAndPasswordExists(response)) {
        var email = response[0][1],
            password = response[1][1];
        Unicycle.exec('updateEmail', email);
        Unicycle.exec('updatePassword', password);
        this._onLoginRequest(true);
      }
      //ensure login page shows if the user logs out
      Unicycle.exec('setShouldRenderLoginPage', true);
    }).done();
  },

  _cachedUsernameAndPasswordExists: function(cache) {
    var cachedEmail = cache[0][1],
        cachedPassword = cache[1][1];
    return cachedEmail && cachedPassword;
  },

  _goToSignUpPage: function() {
    Unicycle.exec('setInSignUpView', true);
  },

  _onLoginRequest: function(requestIsAnAutoLoginAttempt) {
    var that = this,
        email = loginStore.getEmail(),
        password = loginStore.getPassword();

    this._savePassword(loginStore.getPassword());

    //fixes weird bug where blank password field validates (cannot replicate at command line with api)
    if (!password) {
      password = '~';
    }
    if (!email) {
      email = '~';
    }

    Unicycle.exec('setLoginInFlight', true);

    AjaxUtils.ajax(
      '/api/login',
      {
        username: email,
        password: password
      },
      (res) => {
        var userId = res.body.userId,
            refreshToken = res.body.refreshToken,
            accessToken = res.body.accessToken,
            email = res.body.username,
            firstName = res.body.firstName,
            lastName = res.body.lastName;

        Unicycle.exec(
          'setAllMetadata',
          accessToken,
          refreshToken,
          userId,
          email,
          firstName,
          lastName
        );
        that._saveUserId(userId);
        that._saveEmail(email);
        that._saveRefreshToken(refreshToken);
        that._saveAccessTokenThenLoadHomePage(accessToken);
        globalAppPageStateStore.setCurrentPage(PAGE_KEYS.landingPage);
      },
      () => {
        if (!requestIsAnAutoLoginAttempt) {
          that._alertFailedLogin();
        }
      }
    );
  },

  //TODO: Think about a better way to interact with phone storage
  //maybe we want to use stores?  Worth revisiting...
  _saveUserId: function(userId) {
    AsyncStorage.setItem('userId', userId);
  },

  _savePassword: function(password) {
    AsyncStorage.setItem('password', password);
  },

  _saveEmail: function(email) {
    AsyncStorage.setItem('email', email);
  },

  _saveRefreshToken: function(refreshToken) {
    AsyncStorage.setItem('refreshToken', refreshToken);
  },

  _saveAccessTokenThenLoadHomePage: function(accessToken) {
    AsyncStorage.setItem('accessToken', accessToken);
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

module.exports = LoginPage;
