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
  postImage: {
    flex: 1,
    justifyContent: "space-around",
    resizeMode: "contain",
    backgroundColor: '#F0F0F0'
  }
});

var Post = React.createClass({

  MAX_IMAGE_HEIGHT: 420,

  propTypes: {
    post: React.PropTypes.object.isRequired,
    viewerIsPostOwner: React.PropTypes.bool,
    renderedFromProfileView: React.PropTypes.bool,
    onSubmitCommentAction: React.PropTypes.func.isRequired,
    likePhotoAction: React.PropTypes.func.isRequired,
    unlikePhotoAction: React.PropTypes.func.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      isCommentRequestInFlight: false,
      isLikeRequestInFlight: false
    };
  },

  render: function() {
    return (
      <View style={styles.container}>

        <PostHeader
          post={this.props.post}
          renderedFromProfileView={this.props.renderedFromProfileView}
          navigator={this.props.navigator}/>

        <TouchableHighlight
          onPress={ this._photoOnClickAction(this.props.post.liked) }
          underlayColor="transparent">
          <Image
            style={[styles.postImage, {height: this._getImageHeight()}]}
            source={{uri: this.props.post.photoUrl}}/>
        </TouchableHighlight>

        <PostFooter
          post={this.props.post}
          onStarPress={this._onStarPress}
          isCommentRequestInFlight={this.state.isCommentRequestInFlight}
          onSubmitCommentAction={this.props.onSubmitCommentAction}
          navigator={this.props.navigator}/>

      </View>
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
    var post = this.props.post,
        userId = userLoginMetadataStore.getUserId();

    if (this.state.isLikeRequestInFlight) {
      return;
    }

    this.setState({
      isLikeRequestInFlight: true
    });
    this.props.likePhotoAction(post.id, post.postIdString, userId, () => {
      this.setState({
        isLikeRequestInFlight: false
      });
    });
  },

  _unlikePost: function() {
    var post = this.props.post,
        userId = userLoginMetadataStore.getUserId();

    this.setState({
      isLikeRequestInFlight: true
    });
    this.props.unlikePhotoAction(post.id, post.postIdString, userId, () => {
      this.setState({
        isLikeRequestInFlight: false
      });
    });
  },

  _getImageHeight: function() {
    var height = this.props.post.imageHeight / 2;
    if (height > 0 && height <= this.MAX_IMAGE_HEIGHT) {
      return height;
    }
    else {
      return this.MAX_IMAGE_HEIGHT;
    }
  }

});

module.exports = Post;
