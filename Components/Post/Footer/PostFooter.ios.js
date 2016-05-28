'use strict';

var React = require('react-native');
var Unicycle = require('../../../Unicycle');
var userLoginMetadataStore = require('../../../stores/UserLoginMetadataStore');
var PostStats = require('./PostStats');
var CommentList = require('./CommentList');
var ViewAllCommentsLink = require('./ViewAllCommentsLink');
var PostCommentsPopup = require('../../PopupPages/PostCommentsPopup');
var PostUtils = require('../../../Utils/Post/PostUtils');

var {
  View,
  Text,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  postFooter: {
    backgroundColor: 'white',
    margin: 8
  },
  caption: {
    fontSize: 15,
    fontWeight: '400',
    color: '#525252'
  }
});

var PostFooter = React.createClass({

  propTypes: {
    post: React.PropTypes.object.isRequired,
    onStarPress: React.PropTypes.func.isRequired,
    isLikeRequestInFlight: React.PropTypes.bool,
    navigator: React.PropTypes.object.isRequired,
    isCommentRequestInFlight: React.PropTypes.bool.isRequired,
    onSubmitCommentCallback: React.PropTypes.func.isRequired
  },

  render: function() {
    var caption, viewAllCommentsLink;

    // TODO: Fix this crap
    if (this.props.post.caption !== '_') {
      caption = this._renderCaption();
    }

    if (this.props.post.numComments > PostUtils.DEFAULT_MAX_COMMENTS_VISIBLE) {
      viewAllCommentsLink = this._renderViewAllCommentsLink();
    }

    return (
      <View style={styles.postFooter}>

        {caption}
        <PostStats
          navigator={this.props.navigator}
          onStarPress={this.props.onStarPress(this.props.post.liked)}
          onCommentPress={this._onCommentPress}
          isLikeRequestInFlight={this.props.isLikeRequestInFlight}
          post={this.props.post}/>

        {viewAllCommentsLink}
        <CommentList
          comments={this.props.post.firstComments}
          maxCommentsToShow={PostUtils.DEFAULT_MAX_COMMENTS_VISIBLE}
          navigator={this.props.navigator}/>

      </View>
    );
  },

  _renderViewAllCommentsLink: function() {
    return (
      <ViewAllCommentsLink
        post={this.props.post}
        onSubmitCommentCallback={this.props.onSubmitCommentCallback}
        navigator={this.props.navigator}/>
    );
  },

  _renderCaption: function() {
    return (
      <Text style={styles.caption}>
        {this.props.post.caption}
      </Text>
    );
  },

  _onCommentPress: function() {
    this.props.navigator.push({
      component: PostCommentsPopup,
      passProps: {
        post: this.props.post,
        commentInputAutoFocus: true,
        onSubmitCommentCallback: this.props.onSubmitCommentCallback
      }
    });
  }

});

module.exports = PostFooter;
