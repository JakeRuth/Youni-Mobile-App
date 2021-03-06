'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Comment = require('./Comment');

var {
  View
} = ReactNative;

var CommentList = React.createClass({

  propTypes: {
    comments: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        commenterName: React.PropTypes.string.isRequired,
        comment: React.PropTypes.string.isRequired,
        commenterEmail: React.PropTypes.string,
        commenterProfilePicture: React.PropTypes.string
      })
    ).isRequired,
    maxCommentsToShow: React.PropTypes.number,
    onDeleteCommentAction: React.PropTypes.func.isRequired,
    post: React.PropTypes.object.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    return (
      <View>
        {this._renderComments()}
      </View>
    );
  },

  _renderComments: function() {
    var commentElements = [],
        commentsJson = this.props.comments;

    for (var i = 0; i < commentsJson.length; i++) {
      if (this.props.maxCommentsToShow && i > this.props.maxCommentsToShow) {
        break;
      }

      commentElements.push(
        <Comment
          comment={commentsJson[i]}
          onDeleteCommentAction={this.props.onDeleteCommentAction}
          post={this.props.post}
          key={i}
          navigator={this.props.navigator}/>
      );
    }
    return commentElements;
  }

});

module.exports = CommentList;
