'use strict';

var React = require('react-native');
var ForgotPasswordPage = require('./SignUp/ForgotPasswordPage');
var LandingPage = require('../LandingPage');
var SignUpForm = require('./SignUp/SignUpForm');
var LoginSignupSelector = require('./SignUp/LoginSignupSelector');
var Spinner = require('./Common/Spinner');
var Unicycle = require('../Unicycle');
var loginStore = require('../stores/LoginStore');
var userLoginMetadataStore = require('../stores/UserLoginMetadataStore');
var AjaxUtils = require('../Utils/Common/AjaxUtils');
GLOBAL = require('../Utils/Common/GlobalColorMap');

var {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  Image,
  TextInput,
  AlertIOS,
  AsyncStorage,
  Dimensions
} = React;

var styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: null,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GLOBAL.COLOR.APP
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
  appNameContainer: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    top: 30
  },
  appName: {
    alignSelf: 'center',
    width: 288, //these dimensions were carefully picked to match the ratio of logo
    height: 120
  },
  loginInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    height: 30,
    width: 250,
    borderRadius: 5,
    textAlign: 'center',
    fontWeight: '100',
    marginBottom: 8
  },
  loginButton: {
    flex: 1,
    width: 150,
    height: 40,
    marginTop: 25,
    borderRadius: 3,
    borderColor: 'white',
    borderWidth: 1
  },
  loginText: {
    flex: 1,
    alignSelf: 'center',
    width: 75,
    paddingTop: 5,
    backgroundColor: 'transparent',
    color: 'white',
    textAlign: 'center',
    fontSize: 23,
    fontWeight: '300'
  },
  forgotPasswordLink: {
    padding: 10,
    color: 'white',
    fontSize: 15
  },
  spinnerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    backgroundColor: 'transparent',
    margin: 300
  }
});

//TODO: this should probably be broken down into smaller components
var LoginPage = React.createClass({

  propType: {
    navigator: React.PropTypes.object.isRequired
  },

  mixins: [
    Unicycle.listenTo(loginStore),
    Unicycle.listenTo(userLoginMetadataStore)
  ],

  getInitialState: function() {
    return {
      inLoginView: false,
      isInSignUpView: false,
      isBackgroundImageLoading: true
    };
  },

  componentDidMount: function () {
    this._attemptToAutoLoginUser();
  },

  render: function () {
    var shouldRenderLoginPage = loginStore.getShouldRenderLoginPage(),
        isLoginInFlight = loginStore.isLoginInFlight(),
        appNameHeader;

    if (!this.state.isInSignUpView) {
      appNameHeader = (
        <View style={styles.appNameContainer}>
          <Image
            style={styles.appName}
            source={require('../images/logoWhiteTextBlankBackground.png')}/>
        </View>
      );
    }

    if (isLoginInFlight || !shouldRenderLoginPage) {
      return (
        <View style={styles.backgroundImage}>
          {this.renderLoadingSpinner()}
        </View>
      );
    }
    else {
      return (
        <Image
          style={styles.backgroundImage}
          source={require('../images/loginBackgroundLoop.gif')}
          resizeMode='cover'
          onLoadStart={() => { this.setState({ isBackgroundImageLoading: true }) }}
          onLoadEnd={() => { this.setState({ isBackgroundImageLoading: false }) }}>

          {this.renderContent(this.state.isBackgroundImageLoading)}
          <LoginSignupSelector
            onLoginPress={this._onLoginSelectorPress}
            onSignupPress={this._onSignUpSelectorPress}/>
          {appNameHeader}

        </Image>
      );
    }
  },

  renderContent: function(isBackgroundImageLoading) {
    if (isBackgroundImageLoading) {
      return (
        <View style={styles.backgroundImage}>
          {this.renderLoadingSpinner()}
        </View>
      );
    }
    else if (this.state.isInSignUpView) {
      return <SignUpForm navigator={this.props.navigator}/>;
    }
    else if (this.state.inLoginView) {
      return this.renderLoginForm();
    }
  },

  renderLoginForm: function () {
    return (
      <View style={styles.contentContainer}>

        <TextInput
          style={styles.loginInput}
          value={loginStore.getEmail()}
          onChangeText={(text) => Unicycle.exec('updateEmail', text)}
          placeholderTextColor='white'
          placeholder='email@college.edu'
          keyboardType='email-address'/>
        <TextInput
          style={styles.loginInput}
          secureTextEntry={true}
          value={loginStore.getPassword()}
          clearTextOnFocus={true}
          placeholderTextColor='white'
          placeholder='password'
          onChangeText={(text) => Unicycle.exec('updatePassword', text)}/>

        <TouchableHighlight
          style={styles.loginButton}
          underlayColor='transparent'
          onPress={this._onLoginRequest}>
          <Text style={styles.loginText}>
            Sign In
          </Text>
        </TouchableHighlight>

        <Text
          style={styles.forgotPasswordLink}
          onPress={this._onForgotPasswordClick}>
          Forgot password?
        </Text>

      </View>
    );
  },

  renderLoadingSpinner: function () {
    return (
      <View style={styles.spinnerContainer}>
        <Spinner/>
      </View>
    );
  },

  _onLoginSelectorPress: function() {
    if (!this.state.inLoginView) {
      this.setState({
        isInSignUpView: false,
        inLoginView: true
      });
    }
    else {
      this.setState({
        isInSignUpView: false,
        inLoginView: false
      });
    }
  },

  _onSignUpSelectorPress: function() {
    if (!this.state.isInSignUpView) {
      this.setState({
        isInSignUpView: true,
        inLoginView: false
      });
    }
    else {
      this.setState({
        isInSignUpView: false,
        inLoginView: false
      });
    }
  },

  _onForgotPasswordClick: function () {
    Unicycle.exec('setShouldRenderLoginPage', false);
    this.props.navigator.push({
      component: ForgotPasswordPage
    });
  },

  _attemptToAutoLoginUser: function () {
    AsyncStorage.multiGet(['email', 'password']).then((response) => {
      if (this._cachedUsernameAndPasswordExists(response)) {
        var email = response[0][1],
            password = response[1][1];
        Unicycle.exec('updateEmail', email);
        Unicycle.exec('updatePassword', password);
        this._onLoginRequest();
      }
      else {
        Unicycle.exec('setShouldRenderLoginPage', true);
      }
    }).done();
  },

  _cachedUsernameAndPasswordExists: function (cache) {
    var cachedEmail = cache[0][1],
        cachedPassword = cache[1][1];
    return cachedEmail && cachedPassword;
  },

  _goToSignUpPage: function () {
    Unicycle.exec('setInSignUpView', true);
  },

  _onLoginRequest: function () {
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
        username: email.toLowerCase(),
        password: password
      },
      (res) => {
        var userId = res.body.userId,
            refreshToken = res.body.refreshToken,
            accessToken = res.body.accessToken,
            email = res.body.username,
            firstName = res.body.firstName,
            lastName = res.body.lastName,
            networkName = res.body.networkName;

        Unicycle.exec(
          'setAllMetadata',
          accessToken,
          refreshToken,
          userId,
          email,
          firstName,
          lastName,
          networkName
        );
        that._saveUserId(userId);
        that._saveEmail(email);
        that._saveRefreshToken(refreshToken);
        that._saveAccessTokenThenLoadHomePage(accessToken);

        that.props.navigator.push({
          component: LandingPage
        });
      },
      () => {
        Unicycle.exec('setShouldRenderLoginPage', true);
        that._alertFailedLogin();
      }
    );
  },

  //TODO: Think about a better way to interact with phone storage
  //maybe we want to use stores?  Worth revisiting...
  _saveUserId: function (userId) {
    AsyncStorage.setItem('userId', userId);
  },

  _savePassword: function (password) {
    AsyncStorage.setItem('password', password);
  },

  _saveEmail: function (email) {
    AsyncStorage.setItem('email', email);
  },

  _saveRefreshToken: function (refreshToken) {
    AsyncStorage.setItem('refreshToken', refreshToken);
  },

  _saveAccessTokenThenLoadHomePage: function (accessToken) {
    AsyncStorage.setItem('accessToken', accessToken);
  },

  _alertFailedLogin: function () {
    Unicycle.exec('setLoginInFlight', false);
    AlertIOS.alert(
      'Login Failed',
      "Make sure you 'Sign Up' AND click the activation link in your email@college.edu",
      [
        {text: 'Try again'}
      ]
    )
  }

});

module.exports = LoginPage;
