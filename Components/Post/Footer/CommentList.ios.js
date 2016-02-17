'use strict';

var React = require('react-native');
var Unicycle = require('../../../Unicycle');
var Comment = require('./Comment');

var {
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  container: {
    marginBottom: 6,
    paddingBottom: 2
  },
  contentSeparatorLine: {
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 6
  },
  viewAllCommentsLink: {
    marginLeft: 8,
    marginBottom: 6
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#B2B2B2'
  }
});

var CommentList = React.createClass({

  propTypes: {
    post: React.PropTypes.object.isRequired,
    postStore: React.PropTypes.any.isRequired,
    navigator: React.PropTypes.object.isRequired,
    postCommentsPopupComponent: React.PropTypes.element
  },

  render: function() {
    var viewAllComments = <View/>;

    if (this.props.post.moreCommentsToShow) {
      viewAllComments = this._renderViewAllCommentsLink();
    }

    return (
      <View style={styles.container}>

        <View style={styles.contentSeparatorLine}/>
        {viewAllComments}
        {this._renderComments()}

      </View>
    );
  },

  _renderComments: function() {
    var comments = [];
    for (var i = 0; i<this.props.post.firstComments.length; i++) {
      var commentJson = this.props.post.firstComments[i];
      comments.push(
        <Comment
          commenterName={commentJson.commenterName}
          commentText={commentJson.comment}/>
      );
    }
    return comments;
  },

  _renderViewAllCommentsLink: function() {
    return (
      <TouchableHighlight
        style={styles.viewAllCommentsLink}
        underlayColor='transparent'
        onPress={this._onViewAllCommentsPress}>
        <Text style={styles.viewAllText}>
          View all {this.props.post.numComments} comments
        </Text>
      </TouchableHighlight>
    );
  },

  _onViewAllCommentsPress: function() {
    this.props.navigator.push({
      component: this.props.postCommentsPopupComponent,
      passProps: {
        post: this.props.post,
        postStore: this.props.postStore
      }
    });
  }

});

module.exports = CommentList;
