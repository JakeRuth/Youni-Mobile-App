'use strict';

var React = require('react-native');
var immutable = require('immutable');

var GroupInfo = require('../Group/GroupInfo');
var GroupPostList = require('../Group/GroupPostList');
var GroupActionButton = require('../Group/GroupActionButton');
var BackArrow = require('../Common/BackArrow');

var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var UserUtils = require('../../Utils/User/UserUtils');
var PostUtils = require('../../Utils/Post/PostUtils');
var GroupUtils = require('../../Utils/Group/GroupUtils');

var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

var INITIAL_PAGE_OFFSET = 0;
var MAX_POSTS_PER_PAGE = 12;

var {
  View,
  Text,
  ScrollView,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  backArrow: {
    height: 30,
    width: 30,
    backgroundColor: 'rgba(0, 0, 0, .25)',
    paddingTop: 4,
    paddingLeft: 9,
    borderRadius: 15
  }
});

var GroupPopup = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired,
    group: React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      name: React.PropTypes.string.isRequired,
      description: React.PropTypes.string.isRequired,
      coverImageUrl: React.PropTypes.string.isRequired,
      badgeImageUrl: React.PropTypes.string.isRequired,
      adminEmails: React.PropTypes.array,
      allTimeTrendPoints: React.PropTypes.number.isRequired,
      numPosts: React.PropTypes.number.isRequired,
      numMembers: React.PropTypes.number.isRequired
    }).isRequired
  },

  getInitialState: function() {
    return {
      group: this.props.group,
      posts: [],
      postsLoading: false,
      postsNextPageLoading: false,
      postOffset: INITIAL_PAGE_OFFSET,
      noMorePostsToFetch: false
    };
  },

  componentWillMount() {
    this._getLatestGroupData();
    this._requestGroupPosts();
  },

  render: function() {
    return (
      <ScrollView
        style={styles.container}
        automaticallyAdjustContentInsets={false}>

        <GroupInfo
          {...this.props}
          group={this.state.group}/>
        <GroupPostList
          posts={immutable.List(this.state.posts)}
          gridViewEnabled={true}
          onLoadMorePostsPress={this._requestGroupPosts}
          noMorePostsToFetch={this.state.noMorePostsToFetch}
          loading={this.state.postsLoading}
          isNextPageLoading={this.state.postsNextPageLoading}
          likePhotoAction={this.likePhotoAction}
          unlikePhotoAction={this.unlikePhotoAction}
          onSubmitCommentAction={this.onSubmitCommentAction}
          navigator={this.props.navigator}/>
        <BackArrow
          style={styles.backArrow}
          onPress={() => { this.props.navigator.pop(); }}/>
        {
          GroupUtils.isUserAdmin(this.state.group, userLoginMetadataStore.getEmail()) &&
          <GroupActionButton
            {...this.props}
            group={this.state.group}
            onPageReturnCallback={this._getLatestGroupData}/>
        }

      </ScrollView>
    );
  },

  _getLatestGroupData: function() {
    var that = this;

    AjaxUtils.ajax(
      '/group/get',
      {
        groupIdString: this.props.group.id
      },
      (res) => {
        that.setState({
          group: res.body.group
        });
      },
      () => {

      }
    );
  },

  _requestGroupPosts: function() {
    var that = this,
        offset = this.state.postOffset;
    
    if (offset == INITIAL_PAGE_OFFSET) {
      this.setState({
        postsLoading: true
      });
    }
    else {
      this.setState({
        postsNextPageLoading: true
      });
    }
    
    AjaxUtils.ajax(
      '/feed/getGroupFeed',
      {
        requestingUserEmail: userLoginMetadataStore.getEmail(),
        groupIdString: that.props.group.id,
        maxToFetch: MAX_POSTS_PER_PAGE,
        fetchOffset: offset
      },
      (res) => {
        var postsArray = PostUtils.createPostsJsonFromGreedy(res.body.posts, offset);
        var newPosts = immutable.List(postsArray);
        var allPosts = immutable.List(that.state.posts).concat(newPosts);
    
        that.setState({
          posts: allPosts,
          postOffset: offset + MAX_POSTS_PER_PAGE,
          postsLoading: false,
          postsNextPageLoading: false,
          noMorePostsToFetch: !res.body.moreToFetch
        });
      },
      () => {
        that.setState({
          postsLoading: false,
          postsNextPageLoading: false
        });
      }
    );
  },

  likePhotoAction(postIndex, postId, userId, callback) {
    var that = this,
        posts = this.state.posts;

    // optimistically like the post
    this.setState({
      posts: PostUtils.increaseLikeCountFromList(that.state.posts, postIndex)
    });

    AjaxUtils.ajax(
      '/post/like',
      {
        postIdString: postId,
        userIdString: userId
      },
      (res) => {
        callback();
      },
      () => {
        callback();
      }
    );
  },

  unlikePhotoAction(postIndex, postId, userId, callback) {
    var posts = this.state.posts,
        that = this;

    // optimistically unlike the post
    this.setState({
      posts: PostUtils.decreaseLikeCountFromList(this.state.posts, postIndex)
    });

    AjaxUtils.ajax(
      '/post/removeLike',
      {
        postIdString: postId,
        userIdString: userId
      },
      (res) => {
        callback();
      },
      () => {
        callback();
      }
    );
  },

  onSubmitCommentAction: function(comment, post, callback) {
    var posts = this.state.posts,
        userId = userLoginMetadataStore.getUserId(),
        commenterName = userLoginMetadataStore.getFullName();

    if (!comment) {
      return;
    }

    AjaxUtils.ajax(
      '/post/createComment',
      {
        postIdString: post.postIdString,
        userIdString: userId,
        comment: comment
      },
      (res) => {
        PostUtils.addCommentFromList(posts, post.id, comment, commenterName);
        callback(comment);
      },
      () => {
        callback(comment);
      }
    );
  }

});

module.exports = GroupPopup;
