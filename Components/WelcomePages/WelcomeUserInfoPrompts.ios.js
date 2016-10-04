'use strict';

var React = require('react');
var ReactNative = require('react-native');

var InitialPromptUploadPicture = require('./InitialPromptUploadPicture');
var PromptToSelectGroups = require('./PromptToSelectGroups');

var Colors = require('../../Utils/Common/Colors');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var WelcomeUserPage = require('../../Utils/Enums/WelcomeUserPage');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var showUploadProfileImagePromptStore = require('../../stores/ShowUploadProfileImagePromptStore');
var exploreFeedOrgsStore = require('../../stores/group/ExploreFeedOrgsStore');

var {
  View,
  Text,
  AlertIOS,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headingContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  heading: {
    flex: 1,
    color: Colors.DARK_GRAY,
    fontSize: 30,
    textAlign: 'center'
  },
  bodyContainer: {
    flex: 5
  },
  skipStepButton: {
    fontSize: 18,
    position: 'absolute',
    top: 27,
    right: 12,
    opacity: .75
  }
});

var WelcomeUserInfoPrompts = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired
  },
  
  getInitialState: function() {
    return {
      page: WelcomeUserPage.UPLOAD_PICTURE
    };
  },

  render: function() {
    var content;

    if (this.state.page === WelcomeUserPage.UPLOAD_PICTURE) {
      content = (
        <InitialPromptUploadPicture
          style={styles.bodyContainer}
          onNextPress={this.goToGroupSelectionPage}/>
      );
    }
    else if (this.state.page === WelcomeUserPage.SELECT_GROUPS) {
      content = (
        <PromptToSelectGroups
          style={styles.bodyContainer}
          onDonePress={this.onDismissPromptPress}
          navigator={this.props.navigator}/>
      );
    }
    
    return (
      <View style={styles.container}>

        {this.renderPageHeader()}
        {content}
        {this.renderSkipButton()}

      </View>
    );
  },

  renderPageHeader: function() {
    return (
      <View style={styles.headingContainer}>
        <Text style={[styles.heading, { color: Colors.getPrimaryAppColor() }]}>
          {this.getPageHeaderLabel()}
        </Text>
      </View>
    );
  },

  renderSkipButton: function() {
    return (
      <Text
        style={[styles.skipStepButton, { color: Colors.getPrimaryAppColor() }]}
        onPress={this.onSkipPress}>
        Skip
      </Text>
    );
  },

  onDismissPromptPress: function() {
    AlertIOS.alert(
      'If you ever need help, access the Help Center from the settings icon on your profile!',
      'Enjoy Youni ^_^',
      [
        {
          text: 'Enter your campus!'
        }
      ]
    );
    userLoginMetadataStore.setShowInitialInfoPrompts(false);
    showUploadProfileImagePromptStore.setShowOnHomeFeed(false);
    showUploadProfileImagePromptStore.setShowOnProfilePage(false);
    this.requestDisabledInfoPrompts();
  },

  getPageHeaderLabel: function() {
    if (this.state.page === WelcomeUserPage.UPLOAD_PICTURE) {
      return `Welcome, ${userLoginMetadataStore.getFirstName()}!`;
    }
    else if (this.state.page === WelcomeUserPage.SELECT_GROUPS) {
      return "Join your organizations!";
    }
  },

  onSkipPress: function() {
    if (this.state.page === WelcomeUserPage.UPLOAD_PICTURE) {
      this.goToGroupSelectionPage();
    }
    else if (this.state.page === WelcomeUserPage.SELECT_GROUPS) {
      this.onDismissPromptPress();
    }
  },

  goToGroupSelectionPage: function() {
    this.setState({
      page: WelcomeUserPage.SELECT_GROUPS
    });
  },

  requestDisabledInfoPrompts: function() {
    AjaxUtils.ajax(
      '/user/disableForceProfilePictureUpload',
      {
        userEmail: userLoginMetadataStore.getEmail()
      },
      (res) => {

      },
      () => {

      }
    );
  }

});

module.exports = WelcomeUserInfoPrompts;
