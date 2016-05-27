'use strict';

var React = require('react-native');
var Unicycle = require('../../../Unicycle');
var Comment = require('./Comment');
var ViewAllCommentsLink = require('./ViewAllCommentsLink');
var PostUtils = require('../../../Utils/Post/PostUtils');

var {
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  container: {
    marginBottom: 6,
    marginLeft: 8,
    marginRight: 8,
    paddingBottom: 2
  }
});

var CommentList = React.createClass({

  propTypes: {
    post: React.PropTypes.object.isRequired,
    navigator: React.PropTypes.object.isRequired,
    renderedFromPostFooter: React.PropTypes.bool
  },

  render: function() {
    var viewAllComments = <View/>;

    if (this.props.post.numComments > PostUtils.DEFAULT_MAX_COMMENTS_VISIBLE && this.props.renderedFromPostFooter) {
      viewAllComments = (
        <ViewAllCommentsLink
          post={this.props.post}
          navigator={this.props.navigator}/>
      )
    }

    return (
      <View style={styles.container}>

        {viewAllComments}
        {this._renderComments()}

      </View>
    );
  },

  _renderComments: function() {
    var comments = [];
    var numCommentsToShowFromFeed;
    if (this.props.renderedFromPostFooter && (this.props.post.firstComments.length > PostUtils.DEFAULT_MAX_COMMENTS_VISIBLE)) {
      numCommentsToShowFromFeed = PostUtils.DEFAULT_MAX_COMMENTS_VISIBLE;
    }
    else {
      numCommentsToShowFromFeed = this.props.post.firstComments.length;
    }
    for (var i = 0; i<numCommentsToShowFromFeed; i++) {
      var commentJson = this.props.post.firstComments[i];
      comments.push(
        <Comment
          commenterName={commentJson.commenterName}
          commentText={commentJson.comment}
          commenterEmail={commentJson.commenterEmail}
          key={i}
          navigator={this.props.navigator}/>
      );
    }
    return comments;
  }

});

module.exports = CommentList;
