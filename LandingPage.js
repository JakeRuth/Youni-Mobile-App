'use strict';

var React = require('react-native');
var HomePage = require('./Components/HomePage');
var SearchPage = require('./SearchPage');
var ProfilePage = require('./ProfilePage');
var TrendingPage = require('./Components/Trending/TrendingPage');
var CreatePostPage = require('./CreatePostPage');
var OverlayPage = require('./Components/Common/OverlayPage');
var Post = require('./Components/Post/Post');
var PostLikesList = require('./Components/Post/Footer/Like/PostLikesList');
var GetAllFollowingPage = require('./Components/Profile/GetAllFollowingPage');
var ProfileModal = require('./Components/Profile/ProfileModal');
var BlockedUsersModal = require('./Components/Profile/Settings/BlockedUsersModal');
var PostCommentsModal = require('./Components/Post/PostCommentsModal');
var Icon = require('react-native-vector-icons/Ionicons');
var loginStore = require('./stores/LoginStore');
var userLoginMetadataStore = require('./stores/UserLoginMetadataStore');
var tabStateStore = require('./stores/TabStateStore');
var explorePostsStore = require('./stores/post/ExplorePostsStore');
var postLikePopupStore = require('./stores/post/like/PostLikePopupStore');
var getAllFollowingStore = require('./stores/user/GetAllFollowingStore');
var Unicycle = require('./Unicycle');

var {
  View,
  Text,
  StyleSheet,
  TabBarIOS,
  AsyncStorage
} = React;

var styles = StyleSheet.create({
  tabBarContainer: {
    flex: 1
  }
});

var LandingPage = React.createClass({

  mixins: [
    Unicycle.listenTo(loginStore),
    Unicycle.listenTo(tabStateStore),
    Unicycle.listenTo(explorePostsStore),
    Unicycle.listenTo(postLikePopupStore),
    Unicycle.listenTo(getAllFollowingStore)
  ],

  componentDidMount: function() {
    //nice little trick to get the spinner to stay during the animation to home page
    AsyncStorage.getItem('accessToken').then(() => {
      Unicycle.exec('setSelectedTab', 'home');
      Unicycle.exec('setLoginInFlight', false);
    }).done();
  },

  render: function() {
    var singlePostPopup = null,
        postLikesPopup = null,
        followingListForUserPopup = null,
        selectedPost = explorePostsStore.getSelectedPost();

    if (selectedPost) {
      var post = (
          <Post
              postStore={explorePostsStore}
              post={selectedPost}/>
      );
      singlePostPopup = (
          <OverlayPage
              content={post}
              onBackArrowPress={() => {explorePostsStore.setSelectedPostId(null);}}/>
      );
    }

    if (postLikePopupStore.isVisible()) {
      postLikesPopup = (
          <OverlayPage
              content={<PostLikesList/>}
              onBackArrowPress={() => {postLikePopupStore.setVisibility(false);}}
              bannerTitle='Likes'/>
      );
    }

    if (getAllFollowingStore.isVisible()) {
      followingListForUserPopup = (
          <OverlayPage
              content={<GetAllFollowingPage/>}
              onBackArrowPress={() => {getAllFollowingStore.setVisibility(false);}}
              bannerTitle='Following'/>
      );
    }

    return (
      <View style={styles.tabBarContainer}>
        <PostCommentsModal/>
        <ProfileModal/>
        <BlockedUsersModal/>

        <TabBarIOS
          tintColor="#0083D4">
          <Icon.TabBarItem
            title="Home"
            iconName="ios-home-outline"
            selectedIconName="ios-home-outline"
            selected={tabStateStore.getSelectedTab() === 'home'}
            onPress={() => {
              this._transitionState('home');
            }}>
            <HomePage/>
          </Icon.TabBarItem>
          <Icon.TabBarItem
            title="Explore"
            iconName="ios-search"
            selectedIconName="ios-search"
            selected={tabStateStore.getSelectedTab() === 'search'}
            onPress={() => {
              Unicycle.exec('setInProfileView', false);
              Unicycle.exec('setInExploreFeedView', true);
              this._transitionState('search');
            }}>
            <SearchPage/>
          </Icon.TabBarItem>
          <Icon.TabBarItem
            title="Take Photo"
            iconName="ios-camera-outline"
            selectedIconName="ios-camera-outline"
            selected={tabStateStore.getSelectedTab() === 'takePhoto'}
            onPress={() => {
              Unicycle.exec('setAnyErrorsOnCreatePostPage', false);
              Unicycle.exec('setShouldShowImagePickerForPost', true);
              this._transitionState('takePhoto');
            }}>
            <CreatePostPage previousTab={tabStateStore.getPreviousTab()}/>
          </Icon.TabBarItem>
          <Icon.TabBarItem
            title="Trending"
            iconName="fireball"
            selectedIconName="fireball"
            selected={tabStateStore.getSelectedTab() === 'trend'}
            onPress={() => {
              this._transitionState('trend');
            }}>
            <TrendingPage/>
          </Icon.TabBarItem>
          <Icon.TabBarItem
            title="Profile"
            iconName="ios-people-outline"
            selectedIconName="ios-people-outline"
            selected={tabStateStore.getSelectedTab() === 'profile'}
            onPress={() => {
              this._transitionState('profile');
            }}>
            <ProfilePage
              email={userLoginMetadataStore.getEmail()}/>
          </Icon.TabBarItem>
        </TabBarIOS>

        {postLikesPopup}
        {singlePostPopup}
        {followingListForUserPopup}
      </View>
    );
  },

  _transitionState: function(selectedTabName) {
    var previousTabName = tabStateStore.getSelectedTab();
    Unicycle.exec('setPreviousTab', previousTabName);
    Unicycle.exec('setSelectedTab', selectedTabName);
  }

});

module.exports = LandingPage;
