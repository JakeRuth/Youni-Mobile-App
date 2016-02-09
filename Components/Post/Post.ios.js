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
    renderedFromProfileView: React.PropTypes.bool
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
          id={this.props.post.id}
          posterEmail={this.props.post.posterEmail}
          posterName={this.props.post.posterName}
          posterProfileImageUrl={this.props.post.posterProfileImageUrl}
          timestamp={this.props.post.timestamp}
          postIdString={this.props.post.postIdString}
          postStore={this.props.postStore}
          numLikes={this.props.post.numLikes}
          caption={this.props.post.caption}
          liked={this.props.post.liked}
          onStarPress={this._onStarPress}
          firstComments={this.props.post.firstComments}
          moreCommentsToShow={this.props.post.moreCommentsToShow}
          numComments={this.props.post.numComments}/>

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
    var action = this._getOnPhotoClickActionName(),
        userId = userLoginMetadataStore.getUserId();
    Unicycle.exec(action, this.props.post.id, this.props.post.postIdString, userId);
  },

  _unlikePost: function() {
    var action = this._getOnStarClickActionName(),
        userId = userLoginMetadataStore.getUserId();
    Unicycle.exec(action, this.props.post.id, this.props.post.postIdString, userId);
  },

  //TODO: Figure out a better way to do this
  _getOnPhotoClickActionName: function() {
    if (this.props.renderedFromProfileView) {
      if (this.props.viewerIsPostOwner) {
        return 'likePostFromOwnerProfilePage';
      }
      else {
        return 'likePostFromProfilePage';
      }
    }
    else {
      if (this.props.postStore.isHomeFeed()) {
        return 'likeHomeFeedPost';
      }
      else {
        return 'likeExploreFeedPost';
      }
    }
  },

  //TODO: Figure out a better way to do this
  _getOnStarClickActionName: function() {
    if (this.props.renderedFromProfileView) {
      if (this.props.viewerIsPostOwner) {
        return 'removeLikeProfileOwner';
      }
      else {
        return 'removeLikeProfile';
      }
    }
    else {
      if (this.props.postStore.isHomeFeed()) {
        return 'removeLikeHomeFeed';
      }
      else {
        return 'removeLikeExploreFeed';
      }
    }
  }

});

module.exports = Post;
