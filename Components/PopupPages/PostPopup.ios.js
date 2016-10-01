'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Icon = require('react-native-vector-icons/MaterialIcons');

var CampusChallengePopup = require('./CampusChallengePopup');
var Post = require('../Post/Post');
var YouniHeader = require('../Common/YouniHeader');
var BackArrow = require('../Common/BackArrow');

var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var Colors = require('../../Utils/Common/Colors');
var LogoImageSize = require('../../Utils/Enums/LogoImageSize');
var PostUtils = require('../../Utils/Post/PostUtils');

var {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  pageHeader: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    marginTop: -12,
    width: LogoImageSize.WIDTH * .1,
    height: LogoImageSize.HEIGHT * .1
  },
  campusChallengeCallout: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.LIGHT_GRAY,
    height: 44,
    width: Dimensions.get('window').width
  },
  campusChallengeCalloutMessage: {
    width: Dimensions.get('window').width - 60, // make room for absolutely position arrow so they don't overlap
    textAlign: 'center',
    fontSize: 14
  },
  campusChallengeArrow: {
    position: 'absolute',
    top: 14,
    right: 12
  }
});

var PostPopup = React.createClass({

  propTypes: {
    post: React.PropTypes.object.isRequired,
    likePhotoAction: React.PropTypes.func,
    unlikePhotoAction: React.PropTypes.func,
    onSubmitCommentAction: React.PropTypes.func,
    onDeleteCommentAction: React.PropTypes.func,
    renderedFromProfileView: React.PropTypes.bool,
    navigator: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      post: this.props.post, // post can change if it get's liked or commented on
      challenge: null
    };
  },

  componentDidMount: function() {
    this.requestCurrentCampusChallenge();
  },

  render: function () {
    return (
      <View style={styles.container}>
        <YouniHeader style={[styles.pageHeader, {backgroundColor: Colors.getPrimaryAppColor()}]}>
          <Image
            style={styles.logo}
            source={require('../../images/logoWhiteTextBlankBackground.png')}/>
          <BackArrow
            onPress={() => this.props.navigator.pop()}
            color="white"/>
        </YouniHeader>

        {this._renderChallengeCallout()}

        <ScrollView automaticallyAdjustContentInsets={false}>

          <Post
            post={this.state.post}
            renderedFromProfileView={this.props.renderedFromProfileView}
            likePhotoAction={this.props.likePhotoAction ? this.props.likePhotoAction : this._likePhotoAction}
            unlikePhotoAction={this.props.unlikePhotoAction ? this.props.unlikePhotoAction : this._unlikePhotoAction}
            onSubmitCommentAction={this.props.onSubmitCommentAction ? this.props.onSubmitCommentAction : this._onSubmitComment}
            onDeleteCommentAction={this.props.onDeleteCommentAction ? this._onDeleteFromPropsWithStateUpdate : this._onDeleteComment}
            navigator={this.props.navigator}/>

        </ScrollView>
      </View>
    );
  },

  _renderChallengeCallout: function() {
    if (this.state.challenge) {
      return (
        <TouchableHighlight
          underlayColor="transparent"
          onPress={() => {
            this.props.navigator.push({
              component: CampusChallengePopup,
              passProps: {
                challenge: this.state.challenge
              }
            });
          }}>

          <View style={styles.campusChallengeCallout}>
            <Text style={[styles.campusChallengeCalloutMessage, { color: Colors.getPrimaryAppColor() }]}>
              This is entered in the {this.state.challenge.name} challenge
            </Text>
            <Icon
              style={styles.campusChallengeArrow}
              name="keyboard-arrow-right"
              size={20}
              color={Colors.getPrimaryAppColor()}/>
          </View>

        </TouchableHighlight>
      );
    }
  },

  requestCurrentCampusChallenge: function() {
    var that = this;
    AjaxUtils.ajax(
      '/campusChallenge/getActiveChallengeForPost',
      {
        postIdString: this.props.post.postIdString,
        userEmail: userLoginMetadataStore.getEmail()
      },
      (res) => {
        that.setState({
          challenge: res.body.challenge
        })
      },
      () => {

      }
    );
  },

  _likePhotoAction(postIndex, postId, userId, callback) {
    var post = this.state.post;
    
    // optimistically like the post
    this.setState({
      post: PostUtils.likePost(post)
    });
    
    AjaxUtils.ajax(
      '/post/like',
      {
        postIdString: postId,
        userIdString: userId
      },
      (res) => {
        callback();
      },
      () => {
        callback();
      }
    );
  },

  _unlikePhotoAction(postIndex, postId, userId, callback) {
    var post = this.state.post;

    // optimistically unlike the post
    this.setState({
      post: PostUtils.unlikePost(post)
    });

    AjaxUtils.ajax(
      '/post/removeLike',
      {
        postIdString: postId,
        userIdString: userId
      },
      (res) => {
        callback();
      },
      () => {
        callback();
      }
    );
  },

  _onSubmitComment: function(comment, post, callback) {
    var posts = this.state.posts,
        userId = userLoginMetadataStore.getUserId(),
        commenterName = userLoginMetadataStore.getFullName(),
        commenterProfileImage = userLoginMetadataStore.getProfileImageUrl();

    if (!comment) {
      return;
    }

    AjaxUtils.ajax(
      '/post/createComment',
      {
        postIdString: post.postIdString,
        userIdString: userId,
        comment: comment
      },
      (res) => {
        PostUtils.addComment(post, comment, commenterName, commenterProfileImage, res.body.commentId);
        callback(comment, res.body.commentId);
      },
      () => {
        
      }
    );
  },

  _onDeleteComment: function(comment, post, callback) {
    var userId = userLoginMetadataStore.getUserId(),
        that = this;

    AjaxUtils.ajax(
      '/post/deleteComment',
      {
        commentIdString: comment.id,
        userIdString: userId
      },
      (res) => {
        that.setState({
          post: PostUtils.deleteComment(post, res.body.firstComments)
        });
        callback();
        that.forceUpdate();
      },
      () => {

      }
    );
  },

  _onDeleteFromPropsWithStateUpdate(comment, post, callback) {
    this.props.onDeleteCommentAction(comment, post, () => {
      this.forceUpdate();
      callback();
    });
  }

});

module.exports = PostPopup;
