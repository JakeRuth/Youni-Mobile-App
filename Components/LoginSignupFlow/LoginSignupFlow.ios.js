'use strict';

var React = require('react-native');
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

var Color = require('../../Utils/Common/GlobalColorMap');
var LoginSignupFlowUtils = require('../../Utils/LoginSignupFlowUtils');
var loginStore = require('../../stores/LoginStore');
var LoginSignupFlowAlerts = require('./LoginSignupFlowAlerts');

var {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions
} = React;

/*
 *
 * The flex amounts here and in it's top level sub components are very important.
 * The UX design makes a 'centralized' button that changes label, but does not change
 * position throughout the entire logout/signup flow (the one with the white background).
 *
 * Use caution when changing them.
 *
 */
var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.YOUNI_PRIMARY_PURPLE
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
    marginTop: -20
  },
  appName: {
    alignSelf: 'center',
    width: 288, //these dimensions were carefully picked to match the ratio of logo
    height: 120
  },
  forgotPasswordLink: {
    paddingTop: 20,
    paddingBottom: 10,
    width: Dimensions.get('window').width,
    color: 'white',
    fontWeight: '100',
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
      email: null,
      password: null,
      confirmPassword: null,
      firstName: null,
      lastName: null,
      gender: null,
      selectedClassYearValue: null,
      isAutoLoginRequestInFlight: true,
      currentPageInFlow: LoginSignupFlowPhases.INITIAL_PAGE,
      showClassYearPicker: false
    };
  },

  componentDidMount: function () {
    LoginSignupFlowUtils.attemptToAutoLoginUser(this._onSuccessfulLoginCallback, this._onFailedLoginCallback);
  },

  mixins: [
    Unicycle.listenTo(loginStore)
  ],

  render: function () {
    if (this.state.isAutoLoginRequestInFlight) {
      return (
        <View style={styles.container}>
          <Spinner/>
        </View>
      );
    }
    else if (this.state.currentPageInFlow === LoginSignupFlowPhases.INITIAL_PAGE) {
      return this._renderInitialPage();
    }
    else if (this.state.currentPageInFlow === LoginSignupFlowPhases.LOGIN_PAGE) {
      return this._renderLoginPage();
    }
    else if (this.state.currentPageInFlow === LoginSignupFlowPhases.CREATE_ACCOUNT_P1) {
      return this._renderSignupPartOne();
    }
    else if (this.state.currentPageInFlow === LoginSignupFlowPhases.CREATE_ACCOUNT_P2) {
      return this._renderSignupPartTwo();
    }
    else if (this.state.currentPageInFlow === LoginSignupFlowPhases.SUCCESSFUL_SIGNUP_PAGE) {
      return this._renderSuccessfulSignupPage();
    }
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
            onLoginPress={() => {
              this.setState({
                currentPageInFlow: LoginSignupFlowPhases.LOGIN_PAGE
              });
            }}
            onCreateAccountPress={() => {
              this.setState({
                currentPageInFlow: LoginSignupFlowPhases.CREATE_ACCOUNT_P1
              });
            }}/>
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
                LoginSignupFlowUtils.loginRequest(this._onSuccessfulLoginCallback, this._onFailedLoginCallback)
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
            action={() => {
              this.setState({
                currentPageInFlow: LoginSignupFlowPhases.CREATE_ACCOUNT_P1
              });
            }}/>
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
          <SignupPartOne
            onEmailInputChange={(email) => { this.setState({ email: email }); }}
            onPasswordInputChange={(password) => { this.setState({ password: password }); }}
            onConfirmPasswordInputChange={(confirmPassword) => { this.setState({ confirmPassword: confirmPassword }); }}/>
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
          <SignupPartTwo
            onFirstNameInputChange={(firstName) => { this.setState({ firstName: firstName }); }}
            onLastNameInputChange={(lastName) => { this.setState({ lastName: lastName }); }}
            onMaleFemaleSelectionChange={(gender) => { this.setState({ gender: gender }); }}
            onClassYearInputPress={() => { this.setState({ showClassYearPicker: true }); }}
            selectedClassYearValue={this.state.selectedClassYearValue}/>
        </View>

        <View style={styles.bottomHalfBodyContainer}>

          <View>
            <CentralizedActionButton
              label="Almost Done!"
              onPress={this._onSignupPageTwoSubmit}/>
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
              onPress={()=>null}/>
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
    this.setState({
      selectedClassYearValue: year,
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
    this.setState({
      isAutoLoginRequestInFlight: false
    });
  },

  _onSignupPageOneSubmit: function() {
    var {email, password, confirmPassword} = this.state;

    if (!email || !password || !confirmPassword) {
      LoginSignupFlowAlerts.missingFields();
    }
    else if (!email.endsWith('.edu') || email.indexOf('@') === -1) {
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
    var {firstName, lastName, gender, selectedClassYearValue} = this.state;

    if (!firstName || !lastName || !gender || !selectedClassYearValue) {
      LoginSignupFlowAlerts.missingFields();
    }
    else {
      console.log('create account');
      this.setState({
        currentPageInFlow: LoginSignupFlowPhases.SUCCESSFUL_SIGNUP_PAGE
      });
    }
  },

  _clearSignupFieldStates: function() {
    this.setState({
      email: null,
      password: null,
      confirmPassword: null,
      firstName: null,
      lastName: null,
      gender: null,
      selectedClassYearValue: null
    })
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
