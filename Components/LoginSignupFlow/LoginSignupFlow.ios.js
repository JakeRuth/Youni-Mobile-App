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
var loginSignupStore = require('../../stores/LoginSignupStore');

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
      isAutoLoginRequestInFlight: true,
      currentPageInFlow: LoginSignupFlowPhases.INITIAL_PAGE,
      showClassYearPicker: false,
      selectedClassYearValue: null
    };
  },

  componentDidMount: function () {
    LoginSignupFlowUtils.attemptToAutoLoginUser(this._onSuccessfulLoginCallback, this._onFailedLoginCallback);
  },

  mixins: [
    Unicycle.listenTo(loginSignupStore)
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
            onLoginPress={this._onLoginPress}
            onCreateAccountPress={this._onCreateAccountPress}/>
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
              showSpinner={loginSignupStore.isLoginRequestInFlight()}/>
          </View>

          <Text
            style={styles.forgotPasswordLink}
            onPress={this._onForgotPasswordClick}>
            Forgot password?
          </Text>

          <FlowNavigationFooter
            label="Don't have an account?"
            clickableLabel="Create Account"
            action={this._onCreateAccountPress}/>
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
              onPress={() => {
                this.setState({
                  currentPageInFlow: LoginSignupFlowPhases.CREATE_ACCOUNT_P2
                });
              }}/>
          </View>

          <AgreeToTermsMessage navigator={this.props.navigator}/>

          <FlowNavigationFooter
            label="Already have an account?"
            clickableLabel="Login"
            action={this._onLoginPress}/>

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
            selectedClassYearValue={this.state.selectedClassYearValue}
            onClassYearInputPress={this.showClassYearPicker}/>
        </View>

        <View style={styles.bottomHalfBodyContainer}>

          <View>
            <CentralizedActionButton
              label="Almost Done!"
              onPress={() => {
                this.setState({
                  currentPageInFlow: LoginSignupFlowPhases.SUCCESSFUL_SIGNUP_PAGE
                });
              }}/>
          </View>

          <AgreeToTermsMessage navigator={this.props.navigator}/>

          <FlowNavigationFooter
            label="Already have an account?"
            clickableLabel="Login"
            action={this._onLoginPress}/>

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
            action={this._onLoginPress}/>
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

  showClassYearPicker: function() {
    this.setState({
      showClassYearPicker: true
    });
  },

  onClassYearPick: function(year) {
    this.setState({
      selectedClassYearValue: year,
      showClassYearPicker: false
    });
  },

  _onLoginPress: function() {
    this.setState({
      currentPageInFlow: LoginSignupFlowPhases.LOGIN_PAGE
    });
  },

  _onForgotPasswordClick: function () {
    this.props.navigator.push({
      component: ForgotPasswordPage
    });
  },

  _onCreateAccountPress: function() {
    this.setState({
      currentPageInFlow: LoginSignupFlowPhases.CREATE_ACCOUNT_P1
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
  }

});

var LoginSignupFlowPhases = {

  INITIAL_PAGE: 'initialPage',
  LOGIN_PAGE: 'login',
  CREATE_ACCOUNT_P1: 'createAccountPartOne',
  CREATE_ACCOUNT_P2: 'createAccountPartTwo',
  SUCCESSFUL_SIGNUP_PAGE: 'successfulSignUpPage'

};


module.exports = LoginSignupFlow;
