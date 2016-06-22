'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var Unicycle = require('./Unicycle');

var profileOwnerStore = require('./stores/profile/ProfileOwnerStore');
var userLoginMetadataStore = require('./stores/UserLoginMetadataStore');
var notificationStore = require('./stores/NotificationStore');

var PostViewTypeEnum = require('./Utils/Post/PostViewTypeEnum');

var MainScreenBanner = require('./MainScreenBanner');
var ProfileInfo = require('./Components/Profile/ProfileInfo');
var ProfilePostList = require('./Components/Profile/ProfilePostList');
var ErrorPage = require('./Components/Common/ErrorPage');
var EditSettingsButton = require('./Components/Profile/Settings/EditSettingsButton');
var ScrollViewRefresh = require('./Components/Common/ScrollViewRefresh');
var NotificationCallout = require('./Components/Common/NotificationCallout');
var Spinner = require('./Components/Common/Spinner');
var NotificationsPopup = require('./Components/PopupPages/NotificationsPopup');

var {
  View,
  ScrollView,
  StyleSheet,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  notificationIconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 17,
    paddingBottom: 0
  },
  unReadNotificationCalloutContainer: {
    position: 'absolute',
    top: 16,
    left: 28
  }
});

var ProfilePage = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired
  },

  mixins: [
    Unicycle.listenTo(profileOwnerStore),
    Unicycle.listenTo(notificationStore)
  ],

  getInitialState: function() {
    return {
      postViewMode: PostViewTypeEnum.LIST
    };
  },

  componentDidMount: function() {
    Unicycle.exec('loadOwnerUsersProfile', userLoginMetadataStore.getEmail());
    this._requestProfilePosts();
  },

  render: function() {
    var isProfileInfoLoading = profileOwnerStore.isProfileInfoLoading(),
        anyErrorsLoadingPage = profileOwnerStore.anyErrorsLoadingPage(),
        numUnreadNotifications = notificationStore.getUnreadNotifications(),
        content, notificationCallout;

    if (numUnreadNotifications) {
      notificationCallout = (
        <View style={styles.unReadNotificationCalloutContainer}>
          <NotificationCallout label={numUnreadNotifications}/>
        </View>
      );
    }

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
            currentPostViewMode={this.state.postViewMode}
            onPostViewControlPress={this.onPostViewControlPress}/>

          <ProfilePostList
            posts={profileOwnerStore.getPosts()}
            user={profileOwnerStore.getUserJson()}
            gridViewEnabled={this.state.postViewMode === PostViewTypeEnum.GRID}
            onPostViewControlPress={this.onPostViewControlPress}
            noMorePostsToFetch={profileOwnerStore.getNoMorePostsToFetch()}
            viewerIsProfileOwner={true}
            loading={profileOwnerStore.isUserPostsRequestInFlight()}
            isNextPageLoading={profileOwnerStore.isLoadMorePostsRequestInFlight()}
            onLoadMorePostsPress={this._requestProfilePosts}
            unlikePhotoAction={this.unlikePhotoAction}
            likePhotoAction={this.likePhotoAction}
            onSubmitCommentAction={this.onSubmitCommentAction}
            navigator={this.props.navigator}/>

        </ScrollView>
      );
    }

    return (
      <View style={styles.container}>

        <MainScreenBanner
          title={profileOwnerStore.getFirstName() + ' ' + profileOwnerStore.getLastName()}/>
        <EditSettingsButton
          user={profileOwnerStore.getUserJson()}
          navigator={this.props.navigator}/>
        {this._renderNotificationIcon()}
        {notificationCallout}
        {content}

      </View>
    );
  },

  _renderNotificationIcon: function() {
    return (
      <TouchableHighlight
        onPress={()=>{
          notificationStore.resetNumUnreadNotifications();
          this.props.navigator.push({
            component: NotificationsPopup
          });
        }}
        style={styles.notificationIconContainer}
        underlayColor='transparent'>
        <Icon
          name='android-notifications-none'
          size={25}
          color='white'/>
      </TouchableHighlight>
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

  onPostViewControlPress: function(postViewType) {
    if (this.state.postViewMode === postViewType) {
      return;
    }

    this.setState({
      postViewMode: postViewType
    });
  },

  _requestProfilePosts: function() {
    var userId = userLoginMetadataStore.getUserId(),
        email = userLoginMetadataStore.getEmail();
    Unicycle.exec('getOwnerUserPosts', email, userId);
  },

  _onErrorPageReload: function() {
    Unicycle.exec('loadOwnerUsersProfile', userLoginMetadataStore.getEmail());
  }

});

module.exports = ProfilePage;
