'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Unicycle = require('../Unicycle');

var NoHomeFeedPostsMessage = require('./NoHomeFeedPostsMessage');
var PostList = require('./Post/PostList');
var Spinner = require('./Common/Spinner');
var YouniHeader = require('./Common/YouniHeader');
var ErrorPage = require('./Common/ErrorPage');

var homePostsStore = require('../stores/post/HomePostsStore');
var userLoginMetadataStore = require('../stores/UserLoginMetadataStore');

var Colors = require('../Utils/Common/Colors');

var {
  View,
  Text,
  StyleSheet
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
            Feed
          </Text>
        </YouniHeader>

        <View style={styles.feedContainer}>
          {content}
        </View>

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
          marginBottom: 40
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
