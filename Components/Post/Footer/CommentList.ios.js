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
    marginLeft: 8,
    marginRight: 8,
    paddingBottom: 2
  },
  viewAllCommentsLink: {
    marginBottom: 6,
    marginTop: 6
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
    navigator: React.PropTypes.object,
    postCommentsPopupComponent: React.PropTypes.any
  },

  render: function() {
    var viewAllComments = <View/>;

    if (this.props.post.moreCommentsToShow && this.props.navigator) {
      viewAllComments = this._renderViewAllCommentsLink();
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
        post: this.props.post
      }
    });
  }

});

module.exports = CommentList;
