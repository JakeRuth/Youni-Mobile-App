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
    posterEmail: React.PropTypes.string.isRequired,
    posterName: React.PropTypes.string.isRequired,
    posterProfileImageUrl: React.PropTypes.string.isRequired,
    timestamp: React.PropTypes.string.isRequired,
    id: React.PropTypes.number.isRequired,
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
          id={this.props.id}
          postIdString={this.props.postIdString}
          posterEmail={this.props.posterEmail}
          posterName={this.props.posterName}
          posterProfileImageUrl={this.props.posterProfileImageUrl}
          timestamp={this.props.timestamp}
          postStore={this.props.postStore}
          comments={this.props.firstComments}
          moreCommentsToShow={this.props.moreCommentsToShow}
          numComments={this.props.numComments}/>
      );
    }

    return (
      <View>

        {comments}
        <CommentInput
          id={this.props.id}
          postStore={this.props.postStore}
          postIdString={this.props.postIdString}/>

      </View>
    );
  }

});

module.exports = PostCommentsContainer;
