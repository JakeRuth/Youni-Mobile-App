'use strict';

var React = require('react-native');
var Unicycle = require('../../../Unicycle');
var userLoginMetadataStore = require('../../../stores/UserLoginMetadataStore');
var PostStats = require('./PostStats');
var Caption = require('./Caption');
var CommentList = require('./CommentList');
var ViewAllCommentsLink = require('./ViewAllCommentsLink');
var PostCommentsPopup = require('../../PopupPages/PostCommentsPopup');
var PostUtils = require('../../../Utils/Post/PostUtils');
var Colors = require('../../../Utils/Common/Colors');

var {
  View,
  Text,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  postFooter: {
    backgroundColor: 'white',
    padding: 10
  },
  blankLine: {
    borderWidth: .5,
    borderColor: Colors.LIGHT_GRAY,
    marginBottom: 8
  }
});

var PostFooter = React.createClass({

  propTypes: {
    post: React.PropTypes.object.isRequired,
    onStarPress: React.PropTypes.func.isRequired,
    navigator: React.PropTypes.object.isRequired,
    isCommentRequestInFlight: React.PropTypes.bool.isRequired,
    onSubmitCommentCallback: React.PropTypes.func.isRequired
  },

  render: function() {
    var caption, viewAllCommentsLink, commentSeparator;

    // TODO: Fix this crap
    if (this.props.post.caption !== '_') {
      caption = (
        <Caption text={this.props.post.caption}/>
      );
    }

    if (this._showCommentSeparator()) {
      commentSeparator = <View style={styles.blankLine}/>;
    }

    if (this.props.post.numComments > PostUtils.DEFAULT_MAX_COMMENTS_VISIBLE) {
      viewAllCommentsLink = this._renderViewAllCommentsLink();
    }

    return (
      <View style={styles.postFooter}>

        <PostStats
          navigator={this.props.navigator}
          onStarPress={this.props.onStarPress(this.props.post.liked)}
          onCommentPress={this._onCommentPress}
          post={this.props.post}/>

        {caption}
        {commentSeparator}
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

  _onCommentPress: function() {
    this.props.navigator.push({
      component: PostCommentsPopup,
      passProps: {
        post: this.props.post,
        commentInputAutoFocus: true,
        onSubmitCommentCallback: this.props.onSubmitCommentCallback
      }
    });
  },

  _showCommentSeparator: function() {
    return this.props.post.numComments > 0;
  }

});

module.exports = PostFooter;
