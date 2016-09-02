'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Unicycle = require('../Unicycle');

var NoHomeFeedPostsMessage = require('./NoHomeFeedPostsMessage');
var InitialLoginTutorialPopup = require('./InitialLoginTutorialPopup');
var NotificationIcon = require('./Notification/NotificationIcon');
var PostList = require('./Post/PostList');
var Spinner = require('./Common/Spinner');
var YouniHeader = require('./Common/YouniHeader');
var NavButton = require('./Common/NavButton');
var ErrorPage = require('./Common/ErrorPage');
var ProfileIcon = require('./Profile/ProfileIcon');
var CreatePostButton = require('./CreatePost/CreatePostButton');

var mainAppSwipePageStore = require('../stores/MainAppSwipePageStore');
var homePostsStore = require('../stores/post/HomePostsStore');
var userLoginMetadataStore = require('../stores/UserLoginMetadataStore');
var Colors = require('../Utils/Common/Colors');
var LogoImageSize = require('../Utils/Enums/LogoImageSize');

var {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  AppRegistry
} = ReactNative;

var styles = StyleSheet.create({
  homePageContainer: {
    flex: 1
  },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  notificationIcon: {
    padding: 12,
    paddingTop: 0
  },
  profileIcon: {
    padding: 12,
    paddingTop: 0
  },
  feedContainer: {
    flex: 1
  },
  logoContainer: {
    flex: 1,
    paddingBottom: 5
  },
  logo: {
    marginTop: -5,
    alignSelf: 'center',
    height: LogoImageSize.HEIGHT * .08,
    width: LogoImageSize.WIDTH * .08
  },
  trendingPageNavButtonContainer: {
    position: 'absolute',
    bottom: 14,
    left: 15
  },
  explorePageNavButtonContainer: {
    position: 'absolute',
    bottom: 14,
    right: 15
  },
  createPostButtonContainer: {
    position: 'absolute',
    bottom: 10,
    // center the button horizontally.  48 is the width on the button
    left: (Dimensions.get('window').width - 48) / 2
  }
});

var HomePage = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired
  },

  mixins: [
    Unicycle.listenTo(homePostsStore),
    Unicycle.listenTo(userLoginMetadataStore)
  ],

  componentDidMount: function() {
    this._requestHomeFeed();
  },

  render: function() {
    var loadingPosts = homePostsStore.isRequestInFlight(),
        anyErrorsLoadingPage = homePostsStore.anyErrorsLoadingPage(),
        homeFeedPosts = homePostsStore.getPosts(),
        content;

    if (loadingPosts) {
      content = <Spinner/>;
    }
    else if (anyErrorsLoadingPage) {
      content = <ErrorPage reloadButtonAction={this._requestHomeFeed}/>
    }
    else if (homeFeedPosts.size) {
      content = this._renderPosts(homeFeedPosts);
    }
    else {
      content = <NoHomeFeedPostsMessage/>;
    }

    return (
      <View style={styles.homePageContainer}>

        <YouniHeader
          style={styles.pageHeader}
          color={Colors.getPrimaryAppColor()}>
          <ProfileIcon
            style={styles.profileIcon}
            navigator={this.props.navigator}/>
          <View style={styles.logoContainer}>
            <Image
              style={styles.logo}
              source={require('../images/logoWhiteTextBlankBackground.png')}/>
          </View>
          <NotificationIcon
            style={styles.notificationIcon}
            navigator={this.props.navigator}/>
        </YouniHeader>

        <View style={styles.feedContainer}>
          {content}
        </View>

        <View style={styles.trendingPageNavButtonContainer}>
          <NavButton
            onPress={() => mainAppSwipePageStore.setSwipeFrameAmount(-1)}
            iconName="equalizer"/>
        </View>
        <View style={styles.createPostButtonContainer}>
          <CreatePostButton navigator={this.props.navigator}/>
        </View>
        <View style={styles.explorePageNavButtonContainer}>
          <NavButton
            onPress={() => mainAppSwipePageStore.setSwipeFrameAmount(1)}
            iconName="explore"/>
        </View>

        <InitialLoginTutorialPopup/>

      </View>
    );
  },

  handleScroll(e) {
    var infiniteScrollThreshold = -1,
        userId = userLoginMetadataStore.getUserId();

    if (e.nativeEvent.contentOffset.y < infiniteScrollThreshold) {
      Unicycle.exec('refreshHomeFeedData');
      Unicycle.exec('requestHomeFeed', userId);
    }
  },

  _renderPosts: function(posts) {
    return (
      <PostList
        posts={posts}
        refreshable={true}
        isFeedRefreshing={homePostsStore.isFeedRefreshing()}
        onScroll={this.handleScroll}
        onLoadMorePostsPress={this._requestHomeFeed}
        isNextPageLoading={homePostsStore.isLoadMorePostsRequestInFlight()}
        noMorePostsToFetch={homePostsStore.getNoMorePostsToFetch()}
        likePhotoAction={this.likePhotoAction}
        unlikePhotoAction={this.unlikePhotoAction}
        onSubmitCommentAction={this.onSubmitCommentAction}
        onDeleteCommentAction={this.onDeleteCommentAction}
        loadMoreButtonStyle={{
          marginBottom: 70
        }}
        navigator={this.props.navigator}/>
    );
  },

  _requestHomeFeed: function() {
    var userId = userLoginMetadataStore.getUserId();
    Unicycle.exec('requestHomeFeed', userId);
  },

  likePhotoAction: function(postIndex, postId, userId, callback) {
    Unicycle.exec('likeHomeFeedPost', postIndex, postId, userId, callback);
  },

  unlikePhotoAction: function(postIndex, postId, userId, callback) {
    Unicycle.exec('removeLikeHomeFeed', postIndex, postId, userId, callback);
  },

  onSubmitCommentAction: function(comment, post, callback) {
    homePostsStore.addCommentOnPost(comment, post, callback);
  },

  onDeleteCommentAction: function(comment, post, callback) {
    homePostsStore.deleteCommentFromPost(comment, post, callback);
  }

});

module.exports = HomePage;
