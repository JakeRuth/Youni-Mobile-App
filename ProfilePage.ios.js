'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var Unicycle = require('./Unicycle');
var profileOwnerStore = require('./stores/profile/ProfileOwnerStore');
var userLoginMetadataStore = require('./stores/UserLoginMetadataStore');
var notificationStore = require('./stores/NotificationStore');
var MainScreenBanner = require('./MainScreenBanner');
var ProfilePageBody = require('./Components/Profile/ProfilePageBody');
var UserPosts = require('./Components/Profile/UserPosts');
var ErrorPage = require('./Components/Common/ErrorPage');
var EditSettingsButton = require('./Components/Profile/Settings/EditSettingsButton');
var ScrollViewRefresh = require('./Components/Common/ScrollViewRefresh');
var NotificationCallout = require('./Components/Common/NotificationCallout');
var NotificationsPopup = require('./Components/PopupPages/NotificationsPopup');

var {
  View,
  ScrollView,
  StyleSheet,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  profilePageContainer: {
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
    email: React.PropTypes.string.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  mixins: [
    Unicycle.listenTo(profileOwnerStore),
    Unicycle.listenTo(notificationStore)
  ],

  componentDidMount: function() {
    Unicycle.exec('loadOwnerUsersProfile', this.props.email);
    this._requestProfilePosts();
  },

  render: function() {
    var isRequestInFlight = profileOwnerStore.isRequestInFlight(),
        anyErrorsLoadingPage = profileOwnerStore.anyErrorsLoadingPage(),
        numUnreadNotifications = notificationStore.getUnreadNotifications(),
        content, notificationCallout;

    if (numUnreadNotifications > 0) {
      notificationCallout = (
        <View style={styles.unReadNotificationCalloutContainer}>
          <NotificationCallout label={numUnreadNotifications}/>
        </View>
      );
    }

    if (anyErrorsLoadingPage) {
      content = <ErrorPage reloadButtonAction={this._onErrorPageReload}/>;
    }
    else {
      content = (
        <ScrollView
          automaticallyAdjustContentInsets={false}
          onScroll={this.handleScroll}>

          <ProfilePageBody
            navigator={this.props.navigator}
            viewerIsProfileOwner={true}
            user={profileOwnerStore.getUserJson()}
            isLoading={profileOwnerStore.isRequestInFlight()}/>

          <UserPosts
            posts={profileOwnerStore.getPosts()}
            profileStore={profileOwnerStore}
            onLoadMorePostsPress={this._requestProfilePosts}
            noMorePostsToFetch={profileOwnerStore.getNoMorePostsToFetch()}
            viewerIsProfileOwner={true}
            loading={profileOwnerStore.isUserPostsRequestInFlight()}
            isNextPageLoading={profileOwnerStore.isLoadMorePostsRequestInFlight()}
            navigator={this.props.navigator}
            unlikePhotoAction={this._unlikePhotoAction}
            likePhotoAction={this._likePhotoAction}/>

        </ScrollView>
      );
    }

    return (
      <View style={styles.profilePageContainer}>

        <MainScreenBanner
          title={profileOwnerStore.getFirstName() + ' ' + profileOwnerStore.getLastName()}/>
        <EditSettingsButton navigator={this.props.navigator}/>
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
      Unicycle.exec('loadOwnerUsersProfile', this.props.email);
      profileOwnerStore.resetPostPageOffset();
      this._requestProfilePosts();
    }
  },

  _likePhotoAction(postIndex, postId, userId, callback) {
    Unicycle.exec('likePostFromOwnerProfilePage', postIndex, postId, userId, callback);
  },

  _unlikePhotoAction(postIndex, postId, userId, callback) {
    Unicycle.exec('removeLikeProfileOwner', postIndex, postId, userId, callback);
  },

  _requestProfilePosts: function() {
    var userId = userLoginMetadataStore.getUserId(),
        email = userLoginMetadataStore.getEmail();
    Unicycle.exec('getOwnerUserPosts', email, userId);
  },

  _onErrorPageReload: function() {
    Unicycle.exec('loadOwnerUsersProfile', this.props.email);
  }

});

module.exports = ProfilePage;
