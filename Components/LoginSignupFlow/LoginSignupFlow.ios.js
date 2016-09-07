'use strict';

var React = require('react');
var ReactNative = require('react-native');
var DismissKeyboard = require('dismissKeyboard');
var Unicycle = require('../../Unicycle');

var LandingPage = require('../LandingPage');
var LoginSignupSelector = require('./LoginSignupSelector');
var FlowNavigationFooter = require('./FlowNavigationFooter');
var CentralizedActionButton = require('./CentralizedActionButton');
var Spinner = require('../Common/Spinner');
var ForgotPasswordPage = require('./ForgotPasswordPage');

var LoginForm = require('./Login/LoginForm');
var SignupPartOne = require('./Signup/SignupPartOne');
var SignupPartTwo = require('./Signup/SignupPartTwo');
var ClassYearPicker = require('./Signup/ClassYearPicker');
var AgreeToTermsMessage = require('./Signup/AgreeToTermsMessage');
var SuccessfulSignupMessage = require('./Signup/SuccessfulSignupMessage');
var SignupProgressBar = require('./Signup/SignupProgressBar');

var Color = require('../../Utils/Common/Colors');
var AutoLoginUtils = require('../../Utils/AutoLoginUtils');
var LogoImageSize = require('../../Utils/Enums/LogoImageSize');
var loginStore = require('../../stores/LoginStore');
var signupStore = require('../../stores/SignupStore');
var LoginSignupFlowAlerts = require('./LoginSignupFlowAlerts');

var {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  AlertIOS,
  TouchableWithoutFeedback
} = ReactNative;

/*
 *
 * The flex amounts here are very important.
 * The UX design makes a 'centralized' button that  does not change
 * position throughout the entire logout/signup flow.
 *
 * Use caution when changing them.
 *
 */
var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  backdropImage: {
    flex: 1,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  headingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  topHalfBodyContainer: {
    flex: 6
  },
  bottomHalfBodyContainer: {
    flex: 4
  },
  appNameContainer: {
    alignSelf: 'flex-start',
    width: Dimensions.get('window').width,
    marginTop: 20
  },
  appName: {
    alignSelf: 'center',
    width: LogoImageSize.WIDTH * .25,
    height: LogoImageSize.HEIGHT * .25
  },
  forgotPasswordLink: {
    backgroundColor: 'transparent',
    paddingTop: 20,
    paddingBottom: 10,
    width: Dimensions.get('window').width,
    color: 'white',
    fontSize: 14,
    textAlign: 'center'
  },
  classYearPickerContainer: {
    position: 'absolute',
    bottom: 0
  }
});

var LoginSignupFlow = React.createClass({

  propType: {
    navigator: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      isAutoLoginRequestInFlight: true,
      currentPageInFlow: LoginSignupFlowPhases.INITIAL_PAGE,
      showClassYearPicker: false
    };
  },

  componentDidMount: function () {
    AutoLoginUtils.attemptToAutoLoginUser(this._onSuccessfulLoginCallback, this._autoLoginFailureCallback);
  },

  mixins: [
    Unicycle.listenTo(loginStore),
    Unicycle.listenTo(signupStore)
  ],

  render: function () {
    var content;
    
    if (this.state.isAutoLoginRequestInFlight) {
      content = (
        <View style={[styles.container, { backgroundColor: Color.getPrimaryAppColor() }]}>
          <Spinner/>
        </View>
      );
    }
    else if (this.state.currentPageInFlow === LoginSignupFlowPhases.INITIAL_PAGE) {
      content = this._renderInitialPage();
    }
    else if (this.state.currentPageInFlow === LoginSignupFlowPhases.LOGIN_PAGE) {
      content = this._renderLoginPage();
    }
    else if (this.state.currentPageInFlow === LoginSignupFlowPhases.CREATE_ACCOUNT_P1) {
      content = this._renderSignupPartOne();
    }
    else if (this.state.currentPageInFlow === LoginSignupFlowPhases.CREATE_ACCOUNT_P2) {
      content = this._renderSignupPartTwo();
    }
    else if (this.state.currentPageInFlow === LoginSignupFlowPhases.SUCCESSFUL_SIGNUP_PAGE) {
      content = this._renderSuccessfulSignupPage();
    }
    
    return (
      <TouchableWithoutFeedback onPress={() => DismissKeyboard()}>
        <Image
          style={styles.backdropImage}
          resizeMode="cover"
          source={require('../../images/backdropLoginSignUp.png')}>
          {content}
        </Image>
      </TouchableWithoutFeedback>
    );
  },

  _renderInitialPage: function() {
    return (
      <View style={styles.container}>

        <View style={styles.headingContainer}>
          <SignupProgressBar visible={false}/>
        </View>

        <View style={styles.topHalfBodyContainer}>
          {this._renderLogo()}
        </View>

        <View style={styles.bottomHalfBodyContainer}>
          <LoginSignupSelector
            onLoginPress={() => { this.setState({ currentPageInFlow: LoginSignupFlowPhases.LOGIN_PAGE }); }}
            onCreateAccountPress={() => { this.setState({ currentPageInFlow: LoginSignupFlowPhases.CREATE_ACCOUNT_P1 }); }}/>
        </View>

      </View>
    );
  },

  _renderLoginPage: function() {
    return (
      <View style={styles.container}>

        <View style={styles.headingContainer}>
          <SignupProgressBar visible={false}/>
        </View>

        <View style={styles.topHalfBodyContainer}>
          {this._renderLogo()}
          <LoginForm/>
        </View>

        <View style={styles.bottomHalfBodyContainer}>
          <View>
            <CentralizedActionButton
              label="Sign In"
              onPress={() => {
                loginStore.loginRequest(this._onSuccessfulLoginCallback, this._onFailedLoginCallback)
              }}
              showSpinner={loginStore.isLoginRequestInFlight()}/>
          </View>

          <Text
            style={styles.forgotPasswordLink}
            onPress={this._onForgotPasswordClick}>
            Forgot password?
          </Text>

          <FlowNavigationFooter
            label="Don't have an account?"
            clickableLabel="Create Account"
            action={() => { this.setState({ currentPageInFlow: LoginSignupFlowPhases.CREATE_ACCOUNT_P1 }); }}/>
        </View>

      </View>
    );
  },

  _renderSignupPartOne: function() {
    return (
      <View style={styles.container}>

        <View style={styles.headingContainer}>
          <SignupProgressBar stepsCompleted={1}/>
        </View>

        <View style={styles.topHalfBodyContainer}>
          <SignupPartOne/>
        </View>

        <View style={styles.bottomHalfBodyContainer}>

          <View>
            <CentralizedActionButton
              label="Next"
              onPress={this._onSignupPageOneSubmit}/>
          </View>

          <AgreeToTermsMessage navigator={this.props.navigator}/>

          <FlowNavigationFooter
            label="Already have an account?"
            clickableLabel="Login"
            action={() => {
              this._clearSignupFieldStates();
              this.setState({
                currentPageInFlow: LoginSignupFlowPhases.LOGIN_PAGE
              });
            }}/>

        </View>

      </View>
    );
  },

  _renderSignupPartTwo: function() {
    return (
      <View style={styles.container}>

        <View style={styles.headingContainer}>
          <SignupProgressBar stepsCompleted={2}/>
        </View>

        <View style={styles.topHalfBodyContainer}>
          <SignupPartTwo onClassYearInputPress={() => { this.setState({ showClassYearPicker: true }); }}/>
        </View>

        <View style={styles.bottomHalfBodyContainer}>

          <View>
            <CentralizedActionButton
              label="Almost Done!"
              onPress={this._onSignupPageTwoSubmit}
              showSpinner={signupStore.isCreateAccountRequestInFlight()}/>
          </View>

          <AgreeToTermsMessage navigator={this.props.navigator}/>

          <FlowNavigationFooter
            label="Already have an account?"
            clickableLabel="Login"
            action={() => {
              this._clearSignupFieldStates();
              this.setState({
                currentPageInFlow: LoginSignupFlowPhases.LOGIN_PAGE
              });
            }}/>

        </View>
        {this._renderClassYearPicker()}

      </View>
    );
  },

  _renderSuccessfulSignupPage: function() {
    return (
      <View style={styles.container}>

        <View style={styles.headingContainer}>
          <SignupProgressBar stepsCompleted={3}/>
        </View>

        <View style={styles.topHalfBodyContainer}>
          <SuccessfulSignupMessage/>
        </View>

        <View style={styles.bottomHalfBodyContainer}>
          <View>
            <CentralizedActionButton
              label="Check your .edu email"
              onPress={()=> LoginSignupFlowAlerts.successfulSignupCheckEmailButton()}/>
          </View>

          <FlowNavigationFooter
            label=""
            clickableLabel="Back to Login"
            action={() => {
              this._clearSignupFieldStates();
              this.setState({
                currentPageInFlow: LoginSignupFlowPhases.LOGIN_PAGE
              });
            }}/>
        </View>

      </View>
    );
  },

  _renderLogo: function() {
    return (
      <View style={styles.appNameContainer}>
        <Image
          style={styles.appName}
          source={require('../../images/logoWhiteTextBlankBackground.png')}/>
      </View>
    );
  },

  _renderClassYearPicker: function() {
    if (this.state.showClassYearPicker) {
      return (
        <View style={styles.classYearPickerContainer}>
          <ClassYearPicker onPick={this.onClassYearPick}/>
        </View>
      );
    }
  },

  onClassYearPick: function(year) {
    signupStore.setClassYear(year);
    this.setState({
      showClassYearPicker: false
    });
  },

  _onForgotPasswordClick: function () {
    this.props.navigator.push({
      component: ForgotPasswordPage
    });
  },

  _onSuccessfulLoginCallback: function() {
    this.props.navigator.push({
      component: LandingPage
    });

    // give the navigator animation time to slide in the LandingPage
    setTimeout(function() {
      this.setState({
        isAutoLoginRequestInFlight: false
      });
    }.bind(this), 500);
  },

  _onFailedLoginCallback: function() {
    AlertIOS.alert(
      'Login Failed',
      'The username/password you entered was incorrect, please try again.',
      [
        {
          text: 'Ok'
        }
      ]
    );
  },

  _onSignupPageOneSubmit: function() {
    var email = signupStore.getEmail(),
        password = signupStore.getPassword(),
        confirmPassword = signupStore.getConfirmPassword(),
        emailContainsWhitespace = email.length !== email.replace(" ", "").length;

    if (!email || !password || !confirmPassword) {
      LoginSignupFlowAlerts.missingFields();
    }
    else if (!email.endsWith('.edu') || email.indexOf('@') === -1 || emailContainsWhitespace) {
      LoginSignupFlowAlerts.unexpectedEmailFormat();
    }
    else if (password !== confirmPassword) {
      LoginSignupFlowAlerts.passwordsMustMatch();
    }
    else if (password.length < this.MIN_PASSWORD_LENGTH) {
      LoginSignupFlowAlerts.passwordNotLongEnough();
    }
    else {
      this.setState({
        currentPageInFlow: LoginSignupFlowPhases.CREATE_ACCOUNT_P2
      });
    }
  },

  _onSignupPageTwoSubmit: function() {
    var firstName = signupStore.getFirstName(),
        lastName = signupStore.getLastName(),
        gender = signupStore.getGender(),
        classYear = signupStore.getClassYear();

    if (!firstName || !lastName || !gender || !classYear) {
      LoginSignupFlowAlerts.missingFields();
    }
    else {
      signupStore.createUser(() => {
        this.setState({
          currentPageInFlow: LoginSignupFlowPhases.SUCCESSFUL_SIGNUP_PAGE
        });
      });
    }
  },

  _autoLoginFailureCallback: function() {
    this.setState({
      isAutoLoginRequestInFlight: false
    });
  },

  _clearSignupFieldStates: function() {
    signupStore.setEmail('');
    signupStore.setPassword('');
    signupStore.setConfirmPassword('');
    signupStore.setFirstName('');
    signupStore.setLastName('');
    signupStore.setGender('');
    signupStore.setClassYear('');
  },

  MIN_PASSWORD_LENGTH: 6

});

var LoginSignupFlowPhases = {

  INITIAL_PAGE: 'initialPage',
  LOGIN_PAGE: 'login',
  CREATE_ACCOUNT_P1: 'createAccountPartOne',
  CREATE_ACCOUNT_P2: 'createAccountPartTwo',
  SUCCESSFUL_SIGNUP_PAGE: 'successfulSignUpPage'

};


module.exports = LoginSignupFlow;
