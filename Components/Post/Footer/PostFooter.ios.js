'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Unicycle = require('../../../Unicycle');

var PostInteractionControls = require('./PostInteractionControls');
var PostGroups = require('./PostGroups');
var Caption = require('./Caption');
var CommentList = require('./CommentList');
var ViewAllCommentsLink = require('./ViewAllCommentsLink');
var ViewLikes = require('./Like/ViewLikes');
var PostCommentsPopup = require('../../PopupPages/PostCommentsPopup');
var PostLikesPopup = require('../../PopupPages/PostLikesPopup');

var userLoginMetadataStore = require('../../../stores/UserLoginMetadataStore');
var PostUtils = require('../../../Utils/Post/PostUtils');
var Colors = require('../../../Utils/Common/Colors');

var {
  View,
  Text,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  postFooter: {
    backgroundColor: 'white',
    padding: 10,
    paddingTop: 5
  },
  statsAndGroupContainer: {
    flexDirection: 'row'
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
    onSubmitCommentAction: React.PropTypes.func.isRequired,
    onDeleteCommentAction: React.PropTypes.func.isRequired
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

        <View style={styles.statsAndGroupContainer}>
          <PostInteractionControls
            style={{ flex: 1 }}
            navigator={this.props.navigator}
            onStarPress={this.props.onStarPress(this.props.post.liked)}
            onCommentPress={this._onCommentPress}
            post={this.props.post}/>
          <PostGroups
            style={{ flex: 1 }}
            groups={this.props.post.groups}
            navigator={this.props.navigator}/>
        </View>

        <ViewLikes
          numLikes={this.props.post.numLikes}
          onPress={() => {
            this.props.navigator.push({
              component: PostLikesPopup,
              passProps: {
                postId: this.props.post.postIdString
              }
            });
          }}/>

        {caption}
        {commentSeparator}
        {viewAllCommentsLink}
        
        <CommentList
          comments={this.props.post.firstComments}
          maxCommentsToShow={PostUtils.DEFAULT_MAX_COMMENTS_VISIBLE}
          onDeleteCommentAction={this.props.onDeleteCommentAction}
          post={this.props.post}
          navigator={this.props.navigator}/>

      </View>
    );
  },

  _renderViewAllCommentsLink: function() {
    return (
      <ViewAllCommentsLink {...this.props}/>
    );
  },

  _onCommentPress: function() {
    this.props.navigator.push({
      component: PostCommentsPopup,
      passProps: {
        post: this.props.post,
        commentInputAutoFocus: true,
        onSubmitCommentAction: this.props.onSubmitCommentAction,
        onDeleteCommentAction: this.props.onDeleteCommentAction
      }
    });
  },

  _showCommentSeparator: function() {
    return this.props.post.numComments > 0;
  }

});

module.exports = PostFooter;
