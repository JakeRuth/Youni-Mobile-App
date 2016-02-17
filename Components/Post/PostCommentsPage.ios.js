'use strict';

var React = require('react-native');
var PostHeader = require('./PostHeader');
var PostCommentsContainer = require('./Footer/PostCommentsContainer');
var Spinner = require('../Common/Spinner');

var {
  View
} = React;

var PostCommentsPopup = React.createClass({

  propTypes: {
    loading: React.PropTypes.bool.isRequired,
    post: React.PropTypes.object.isRequired,
    postStore: React.PropTypes.any.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    var content;

    if (this.props.loading) {
      content = (
        <Spinner/>
      );
    }
    else {
      content = this._renderContent();
    }

    return (
      <View>
        {content}
      </View>
    );
  },

  _renderContent: function() {
    return (
      <View>
        <PostHeader
          id={this.props.post.id}
          postIdString={this.props.post.postIdString}
          posterEmail={this.props.post.posterEmail}
          viewerIsPostOwner={false}
          posterName={this.props.post.posterName}
          posterProfileImageUrl={this.props.post.posterProfileImageUrl}
          timestamp={this.props.post.timestamp}
          renderedFromProfileView={false}
          hideActionButton={true}/>

        <PostCommentsContainer
          post={this.props.post}
          postStore={this.props.postStore}
          navigator={this.props.navigator}/>
      </View>
    );
  }

});

module.exports = PostCommentsPopup;
