'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Unicycle = require('../../Unicycle');

var profileOwnerStore = require('../../stores/profile/ProfileOwnerStore');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var statusBarStyleStore = require('../../stores/StatusBarStyleStore');
var showUploadProfileImagePromptStore = require('../../stores/ShowUploadProfileImagePromptStore');

var PostViewType = require('../../Utils/Enums/PostViewType');
var AlignCallout = require('../../Utils/Enums/AlignCallout');
var Colors = require('../../Utils/Common/Colors');
var IosStatusBarStyles = require('../../Utils/Common/IosStatusBarStyles');

var ProfileInfo = require('./ProfileInfo');
var ProfilePostList = require('./ProfilePostList');
var EditSettingsButton = require('./Settings/EditSettingsButton');
var YouniHeader = require('../Common/YouniHeader');
var ErrorPage = require('../Common/ErrorPage');
var Spinner = require('../Common/Spinner');
var BackArrow = require('../Common/BackArrow');
var UploadProfilePictureCallout = require('../Common/UploadProfilePictureCallout');
var EditProfilePopup = require('../PopupPages/EditProfilePopup');

var {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  pageHeader: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center'
  },
  uploadProfileImageCalloutContainer: {
    position: 'absolute',
    top: 55,
    right: 3
  }
});

var ProfileOwnerPage = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired
  },

  mixins: [
    Unicycle.listenTo(profileOwnerStore)
  ],

  componentDidMount: function() {
    statusBarStyleStore.setDelayedStyle(IosStatusBarStyles.DEFAULT, 100);
    Unicycle.exec('loadOwnerUsersProfile', userLoginMetadataStore.getEmail());
    this._requestProfilePosts();
  },

  render: function() {
    var isProfileInfoLoading = profileOwnerStore.isProfileInfoLoading(),
        anyErrorsLoadingPage = profileOwnerStore.anyErrorsLoadingPage(),
        content;

    if (isProfileInfoLoading) {
      content = (
        <Spinner/>
      );
    }
    else if (anyErrorsLoadingPage) {
      content = <ErrorPage reloadButtonAction={this._onErrorPageReload}/>;
    }
    else {
      content = (
        <ScrollView
          automaticallyAdjustContentInsets={false}
          onScroll={this.handleScroll}>

          <ProfileInfo
            navigator={this.props.navigator}
            viewerIsProfileOwner={true}
            user={profileOwnerStore.getUserJson()}
            currentPostViewMode={profileOwnerStore.getPostViewMode()}
            onPostViewControlPress={this.onPostViewControlPress}/>

          <ProfilePostList
            posts={profileOwnerStore.getPosts()}
            user={profileOwnerStore.getUserJson()}
            gridViewEnabled={profileOwnerStore.getPostViewMode() === PostViewType.GRID}
            onPostViewControlPress={this.onPostViewControlPress}
            noMorePostsToFetch={profileOwnerStore.getNoMorePostsToFetch()}
            viewerIsProfileOwner={true}
            loading={profileOwnerStore.isUserPostsRequestInFlight()}
            isNextPageLoading={profileOwnerStore.isLoadMorePostsRequestInFlight()}
            onLoadMorePostsPress={this._requestProfilePosts}
            unlikePhotoAction={this.unlikePhotoAction}
            likePhotoAction={this.likePhotoAction}
            onSubmitCommentAction={this.onSubmitCommentAction}
            onDeleteCommentAction={this.onDeleteCommentAction}
            navigator={this.props.navigator}/>

        </ScrollView>
      );
    }

    return (
      <View style={styles.container}>

        <YouniHeader>
          <Text style={[styles.pageHeader, { color: Colors.getPrimaryAppColor() }]}>
            {profileOwnerStore.getFirstName() + ' ' + profileOwnerStore.getLastName()}
          </Text>
          <BackArrow onPress={() => {
            this.props.navigator.pop();
            statusBarStyleStore.setStyle(IosStatusBarStyles.LIGHT_CONTENT);
          }}/>
        </YouniHeader>
        <EditSettingsButton
          user={profileOwnerStore.getUserJson()}
          navigator={this.props.navigator}/>
        
        {content}

        <View style={styles.uploadProfileImageCalloutContainer}>
          <UploadProfilePictureCallout
            isVisible={showUploadProfileImagePromptStore.getShowOnProfilePage()}
            align={AlignCallout.TOP_RIGHT}
            onPress={()=>{
              this.props.navigator.push({
                component: EditProfilePopup,
                passProps: {
                  user: profileOwnerStore.getUserJson()
                }
              });
              // allow time for the navigator to push the profile page onto the stack
              setTimeout(function() {
                showUploadProfileImagePromptStore.setShowOnProfilePage(false);
              }, 200);
            }}/>
        </View>

      </View>
    );
  },

  handleScroll(e) {
    var infiniteScrollThreshold = -1;

    if (e.nativeEvent.contentOffset.y < infiniteScrollThreshold) {
      Unicycle.exec('loadOwnerUsersProfile', userLoginMetadataStore.getEmail());
      profileOwnerStore.resetPostPageOffset();
      this._requestProfilePosts();
    }
  },

  likePhotoAction: function(postIndex, postId, userId, callback) {
    Unicycle.exec('likePostFromOwnerProfilePage', postIndex, postId, userId, callback);
  },

  unlikePhotoAction: function(postIndex, postId, userId, callback) {
    Unicycle.exec('removeLikeProfileOwner', postIndex, postId, userId, callback);
  },

  onSubmitCommentAction: function(comment, post, callback) {
    profileOwnerStore.addCommentOnPost(comment, post, callback);
  },

  onDeleteCommentAction: function(comment, post, callback) {
    profileOwnerStore.deleteCommentFromPost(comment, post, callback);
  },

  onPostViewControlPress: function(postViewType) {
    if (profileOwnerStore.getPostViewMode() === postViewType) {
      return;
    }

    profileOwnerStore.setPostViewMode(postViewType);
  },

  _requestProfilePosts: function() {
    var userId = userLoginMetadataStore.getUserId(),
        email = userLoginMetadataStore.getEmail();
    Unicycle.exec('getOwnerUserPosts', email, userId, true);
  },

  _onErrorPageReload: function() {
    Unicycle.exec('loadOwnerUsersProfile', userLoginMetadataStore.getEmail());
  }

});

module.exports = ProfileOwnerPage;
