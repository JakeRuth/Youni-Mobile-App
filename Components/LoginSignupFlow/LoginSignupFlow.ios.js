'use strict';

var React = require('react-native');
var SignupProgressBar = require('./Signup/SignupProgressBar');
var LoginSignupSelector = require('./LoginSignupSelector');
var LoginForm = require('./Login/LoginForm');
var CentralizedActionButton = require('./CentralizedActionButton');
var SignupPartOne = require('./Signup/SignupPartOne');
var AgreeToTermsMessage = require('./Signup/AgreeToTermsMessage');
var FlowNavigationFooter = require('./FlowNavigationFooter');
var Color = require('../../Utils/Common/GlobalColorMap');

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
    flex: 5
  },
  bottomHalfBodyContainer: {
    flex: 5
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
    marginTop: 20,
    width: Dimensions.get('window').width,
    color: 'white',
    fontWeight: '100',
    textAlign: 'center'
  }
});

var LoginSignupFlow = React.createClass({

  propType: {
    navigator: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      currentPageInFlow: LoginSignupFlowPhases.INITIAL_PAGE
    };
  },

  componentDidMount: function () {
    //this._attemptToAutoLoginUser();
  },

  render: function () {
    if (this.state.currentPageInFlow === LoginSignupFlowPhases.INITIAL_PAGE) {
      return this._renderInitialPage();
    }
    else if (this.state.currentPageInFlow === LoginSignupFlowPhases.LOGIN) {
      return this._renderLoginPage();
    }
    else if (this.state.currentPageInFlow === LoginSignupFlowPhases.CREATE_ACCOUNT_P1) {
      return this._renderSignupPartOne();
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
              onPress={()=>null}/>
          </View>

          <Text style={styles.forgotPasswordLink}>
            Forgot password?
          </Text>

          <FlowNavigationFooter
            heading="Don't have an account?"
            navButtonLabel="Create Account"
            navButtonAction={this._onCreateAccountPress}/>
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
              onPress={()=>null}/>
          </View>

          <AgreeToTermsMessage/>

          <FlowNavigationFooter
            heading="Already have an account?"
            navButtonLabel="Login"
            navButtonAction={this._onLoginPress}/>

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

  _onLoginPress: function() {
    this.setState({
      currentPageInFlow: LoginSignupFlowPhases.LOGIN
    });
  },

  _onCreateAccountPress: function() {
    this.setState({
      currentPageInFlow: LoginSignupFlowPhases.CREATE_ACCOUNT_P1
    });
  }

});

var LoginSignupFlowPhases = {

  INITIAL_PAGE: 'initialPage',
  LOGIN: 'login',
  CREATE_ACCOUNT_P1: 'createAccountPartOne'

};


module.exports = LoginSignupFlow;
