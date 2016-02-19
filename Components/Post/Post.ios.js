'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var PostHeader = require('./PostHeader');
var PostFooter = require('./Footer/PostFooter');

var {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginBottom: 12
  },
  imageContainer: {
    flex: 1
  },
  postImage: {
    flex: 1,
    width: null,
    height: 416
  }
});

var Post = React.createClass({

  propTypes: {
    postStore: React.PropTypes.any.isRequired,
    post: React.PropTypes.object.isRequired,
    viewerIsPostOwner: React.PropTypes.bool,
    renderedFromProfileView: React.PropTypes.bool,
    likePhotoAction: React.PropTypes.func,
    unlikePhotoAction: React.PropTypes.func,
    navigator: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      isLikeRequestInFlight: false,
      isCommentRequestInFlight: false
    };
  },

  render: function() {
    return (
      <View style={styles.container}>

        <PostHeader
          id={this.props.post.id}
          postIdString={this.props.post.postIdString}
          posterEmail={this.props.post.posterEmail}
          posterName={this.props.post.posterName}
          posterProfileImageUrl={this.props.post.posterProfileImageUrl}
          timestamp={this.props.post.timestamp}
          renderedFromProfileView={this.props.renderedFromProfileView}/>

        <TouchableHighlight onPress={ this._photoOnClickAction(this.props.post.liked) }>
          <View style={styles.imageContainer}>
            <Image
              style={styles.postImage}
              source={{uri: this.props.post.photoUrl}}/>
          </View>
        </TouchableHighlight>

        <PostFooter
          post={this.props.post}
          onStarPress={this._onStarPress}
          isLikeRequestInFlight={this.state.isLikeRequestInFlight || this.props.postStore.isLikeRequestInFlight()}
          onSubmitComment={this._onSubmitComment}
          isCommentRequestInFlight={this.state.isCommentRequestInFlight}
          navigator={this.props.navigator}/>

      </View>
    );
  },

  _onSubmitComment: function(comment) {
    this.setState({
      isCommentRequestInFlight: true
    });
    this.props.postStore.addCommentOnPost(
      this.props.post.id,
      this.props.post.postIdString,
      userLoginMetadataStore.getUserId(),
      comment,
      userLoginMetadataStore.getFullName(),
      () => {
        this.setState({
          isCommentRequestInFlight: false
        });
      }
    );
  },

  _onStarPress: function(liked) {
    if (liked) {
      return this._unlikePost;
    }
    else {
      return this._likePost;
    }
  },

  _photoOnClickAction: function(liked) {
    if (!liked) {
      return this._likePost;
    }
    else {
      return () => { /* do nothing */ };
    }
  },

  _likePost: function() {
    if (this.props.likePhotoAction) {
      this.setState({
        isLikeRequestInFlight: true
      });

      this.props.likePhotoAction(() => {
        this.setState({
          isLikeRequestInFlight: false
        });
      });
    }
    else {
      var action = this._getOnPhotoClickActionName(),
          userId = userLoginMetadataStore.getUserId();
      Unicycle.exec(action, this.props.post.id, this.props.post.postIdString, userId);
    }
  },

  _unlikePost: function() {
    if (this.props.unlikePhotoAction) {
      this.setState({
        isLikeRequestInFlight: true
      });

      this.props.unlikePhotoAction(() => {
        this.setState({
          isLikeRequestInFlight: false
        });
      });
    }
    else {
      var action = this._getOnStarClickActionName(),
          userId = userLoginMetadataStore.getUserId();
      Unicycle.exec(action, this.props.post.id, this.props.post.postIdString, userId);
    }
  },

  //TODO: Figure out a better way to do this
  _getOnPhotoClickActionName: function() {
    if (this.props.postStore.isHomeFeed()) {
      return 'likeHomeFeedPost';
    }
    else {
      return 'likeExploreFeedPost';
    }
  },

  //TODO: Figure out a better way to do this
  _getOnStarClickActionName: function() {
    if (this.props.postStore.isHomeFeed()) {
      return 'removeLikeHomeFeed';
    }
    else {
      return 'removeLikeExploreFeed';
    }
  }

});

module.exports = Post;
