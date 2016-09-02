'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Icon = require('react-native-vector-icons/MaterialIcons');
var Unicycle = require('../Unicycle');

var NoHomeFeedPostsMessage = require('./NoHomeFeedPostsMessage');
var InitialLoginTutorialPopup = require('./InitialLoginTutorialPopup');
var PostList = require('./Post/PostList');
var Spinner = require('./Common/Spinner');
var YouniHeader = require('./Common/YouniHeader');
var ErrorPage = require('./Common/ErrorPage');
var ProfileIcon = require('./Profile/ProfileIcon');

var mainAppSwipePageStore = require('../stores/MainAppSwipePageStore');
var homePostsStore = require('../stores/post/HomePostsStore');
var userLoginMetadataStore = require('../stores/UserLoginMetadataStore');
var Colors = require('../Utils/Common/Colors');
var LogoImageSize = require('../Utils/Enums/LogoImageSize');

var {
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  homePageContainer: {
    flex: 1
  },
  pageHeader: {
    flex: 1,
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    color: 'white'
  },
  profileIcon: {
    position: 'absolute',
    right: 0,
    top: 0,
    paddingTop: 26,
    paddingRight: 16,
    paddingLeft: 30,
    paddingBottom: 15
  },
  homeNavButtonContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    paddingTop: 26,
    paddingLeft: 16,
    paddingRight: 30,
    paddingBottom: 15
  },
  feedContainer: {
    flex: 1
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

        <YouniHeader color={Colors.getPrimaryAppColor()}>
          <Text style={styles.pageHeader}>
            Me
          </Text>
          <ProfileIcon
            style={styles.profileIcon}
            navigator={this.props.navigator}/>
          {this._renderHomeNavButton()}
        </YouniHeader>

        <View style={styles.feedContainer}>
          {content}
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

  _renderHomeNavButton: function() {
    return (
      <TouchableHighlight
        style={styles.homeNavButtonContainer}
        underlayColor="transparent"
        onPress={() => mainAppSwipePageStore.setSwipeFrameAmount(-1)}>
        <Icon
          name='home'
          size={30}
          color='white'/>
      </TouchableHighlight>
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
