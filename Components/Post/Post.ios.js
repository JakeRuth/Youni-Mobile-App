'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Unicycle = require('../../Unicycle');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var PostHeader = require('./PostHeader');
var PostFooter = require('./Footer/PostFooter');

var {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableWithoutFeedback
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginBottom: 1
  },
  postImage: {
    flex: 1,
    justifyContent: "space-around",
    backgroundColor: '#F0F0F0'
  }
});

var Post = React.createClass({

  MAX_IMAGE_HEIGHT: 420,
  DOUBLE_TAP_TIME_CONSTRAINT: 250,

  propTypes: {
    post: React.PropTypes.object.isRequired,
    /* 
     * this is needed for two reasons:
     * 1) When this component was created, it was intended for Posts only so all the post action parameters are very opinionated
     * 2) There is an immediate business need for the campus challenge feature and there is unfortunately not enough time for me
     *    to refactor all this code to make this component more extensible, still not sure if that would be the right move anyways
     */
    renderedFromCampusChallenge: React.PropTypes.bool,
    renderedFromProfileView: React.PropTypes.bool,
    onSubmitCommentAction: React.PropTypes.func.isRequired,
    onDeleteCommentAction: React.PropTypes.func.isRequired,
    likePhotoAction: React.PropTypes.func.isRequired,
    unlikePhotoAction: React.PropTypes.func.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      isLikeRequestInFlight: false,
      timeOfLastPhotoTap: 0
    };
  },

  render: function() {
    return (
      <View style={styles.container}>

        <PostHeader {...this.props}/>

        <TouchableWithoutFeedback onPress={this._onDoubleTapPhotoAction}>
          <Image
            style={[styles.postImage, {height: this._getImageHeight()}]}
            resizeMode="cover"
            source={{uri: this.props.post.photoUrl}}/>
        </TouchableWithoutFeedback>

        <PostFooter
          {...this.props}
          onStarPress={this._onStarPress}/>

      </View>
    );
  },

  _onStarPress: function(liked) {
    if (this.props.renderedFromCampusChallenge) {
      if (liked) {
        return this.props.unlikePhotoAction;
      }
      else {
        return this.props.likePhotoAction;
      }
    }
    else {
      if (liked) {
        return this._unlikePost;
      }
      else {
        return this._likePost;
      }
    }
  },

  _onDoubleTapPhotoAction: function() {
    var timeDifference = new Date().getTime() - this.state.timeOfLastPhotoTap;

    if (timeDifference < this.DOUBLE_TAP_TIME_CONSTRAINT) {
      this._photoOnClickAction(this.props.post.liked);
    }

    this.setState({
      timeOfLastPhotoTap: new Date().getTime()
    });
  },

  _photoOnClickAction: function(liked) {
    if (!liked) {
      this._likePost();
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
