'use strict'

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
    borderColor: '#E5E5E5',
    borderBottomWidth: 1,
    marginBottom: 6,
    paddingBottom: 2
  },
  contentSeparatorLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
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
    comments: React.PropTypes.array,
    moreCommentsToShow: React.PropTypes.bool.isRequired,
    numComments: React.PropTypes.number.isRequired
  },

  render: function() {
    var viewAllComments = <View/>;

    if (this.props.moreCommentsToShow) {
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
    for (var i = 0; i<this.props.comments.length; i++) {
      var commentJson = this.props.comments[i];
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
        onPress={()=>{}}>
        <Text style={styles.viewAllText}>
          View all {this.props.numComments} comments
        </Text>
      </TouchableHighlight>
    );
  }

});

module.exports = CommentList;
