'use strict';

var React = require('react-native');
var Unicycle = require('../../../Unicycle');
var CommentInput = require('./CommentInput');
var CommentList = require('./CommentList');

var {
  View
} = React;

var PostCommentsContainer = React.createClass({

  propTypes: {
    postCommentsPopupComponent: React.PropTypes.element,
    post: React.PropTypes.object.isRequired,
    postStore: React.PropTypes.any.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    var comments = <View/>;

    if (this.props.post.firstComments.length) {
      comments = (
        <CommentList
          postCommentsPopupComponent={this.props.postCommentsPopupComponent}
          post={this.props.post}
          postStore={this.props.postStore}
          navigator={this.props.navigator}/>
      );
    }

    return (
      <View>

        {comments}
        <CommentInput
          id={this.props.post.id}
          postStore={this.props.postStore}
          postIdString={this.props.post.postIdString}/>

      </View>
    );
  }

});

module.exports = PostCommentsContainer;
