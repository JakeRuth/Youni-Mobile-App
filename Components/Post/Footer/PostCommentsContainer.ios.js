'use strict'

var React = require('react-native');
var Unicycle = require('../../../Unicycle');
var CommentInput = require('./CommentInput');
var CommentList = require('./CommentList');

var {
  View
} = React;

var PostCommentsContainer = React.createClass({

  propTypes: {
    postStore: React.PropTypes.any.isRequired,
    postIdString: React.PropTypes.string.isRequired,
    firstComments: React.PropTypes.array,
    moreCommentsToShow: React.PropTypes.bool.isRequired,
    numComments: React.PropTypes.number.isRequired,
  },

  render: function() {
    var comments = <View/>;

    if (this.props.firstComments.length) {
      comments = (
        <CommentList
          comments={this.props.firstComments}
          moreCommentsToShow={this.props.moreCommentsToShow}
          numComments={this.props.numComments}/>
      );
    }

    return (
      <View>

        {comments}
        <CommentInput/>

      </View>
    );
  }

});

module.exports = PostCommentsContainer;
