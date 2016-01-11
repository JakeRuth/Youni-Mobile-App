'use strict'

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var PostHeader = require('./PostHeader');
var PostLikeBar = require('./Like/PostLikeBar');

var {
  View,
  Text,
  Image,
  PixelRatio,
  StyleSheet,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  imageContainer: {
    flex: 1
  },
  postImage: {
    flex: 1,
    width: null,
    height: 416
  },
  postFooter: {
    flexDirection: 'column',
    backgroundColor: 'white'
  },
  caption: {
    fontSize: 15,
    borderBottomWidth: 2,
    marginTop: 12,
    marginBottom: 12,
    marginLeft: 16,
    marginRight: 16,
    color: '#666',
    borderBottomColor: 'black'
  },
  blankLine: {
    borderWidth: 1 / PixelRatio.get(),
    borderColor: 'lightgray',
    marginLeft: 16,
    marginRight: 16
  },
  postSeparator: {
    borderWidth: 16,
    borderColor: 'transparent'
  }
});

var Post = React.createClass({

  propTypes: {
    postStore: React.PropTypes.any.isRequired,
    id: React.PropTypes.number.isRequired,
    //cannot be required because not all user's will have uploaded a profile pic
    posterProfileImageUrl: React.PropTypes.string,
    posterEmail: React.PropTypes.string.isRequired,
    posterName: React.PropTypes.string.isRequired,
    timestamp: React.PropTypes.string.isRequired,
    photoUrl: React.PropTypes.string.isRequired,
    numLikes: React.PropTypes.number.isRequired,
    caption: React.PropTypes.string.isRequired,
    postIdString: React.PropTypes.string.isRequired,
    liked: React.PropTypes.bool.isRequired,
    viewerIsPostOwner: React.PropTypes.bool,
    renderedFromProfileView: React.PropTypes.bool
  },

  render: function() {
    return (
      <View>

        <PostHeader
          id={this.props.id}
          postIdString={this.props.postIdString}
          posterEmail={this.props.posterEmail}
          viewerIsPostOwner={this.props.viewerIsPostOwner}
          posterName={this.props.posterName}
          posterProfileImageUrl={this.props.posterProfileImageUrl}
          timestamp={this.props.timestamp}
          renderedFromProfileView={this.props.renderedFromProfileView}/>

        <TouchableHighlight onPress={ this._photoOnClickAction(this.props.liked) }>
          <View style={styles.imageContainer}>
            <Image style={styles.postImage}
                   source={{uri: this.props.photoUrl}} />
          </View>
        </TouchableHighlight>

        <View style={styles.postFooter}>
          <Text style={styles.caption}>{this.props.caption == '_' ? '' : this.props.caption }</Text>{/*TODO: Fix this crap*/}
            <View style={styles.blankLine} />
          <PostLikeBar
            postStore={this.props.postStore}
            onStarPress={this._onStarPress(this.props.liked)}
            liked={this.props.liked}
            numLikes={this.props.numLikes}
            postIdString={this.props.postIdString} />
        </View>
        <View style={styles.postSeparator} />

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
    Unicycle.exec(action, this.props.id, this.props.postIdString, userId);
  },

  _unlikePost: function() {
    var action = this._getOnStarClickActionName(),
        userId = userLoginMetadataStore.getUserId();
    Unicycle.exec(action, this.props.id, this.props.postIdString, userId);
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
