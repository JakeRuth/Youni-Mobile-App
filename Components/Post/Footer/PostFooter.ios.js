'use strict';

var React = require('react-native');
var Unicycle = require('../../../Unicycle');
var userLoginMetadataStore = require('../../../stores/UserLoginMetadataStore');
var PostHeader = require('../PostHeader');
var PostStats = require('./PostStats');
var PostCommentsContainer = require('./PostCommentsContainer');
var PostCommentsPopup = require('../../PopupPages/PostCommentsPopup');

var {
  View,
  Text,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  postFooter: {
    backgroundColor: 'white'
  },
  caption: {
    fontSize: 15,
    fontWeight: '400',
    marginTop: 6,
    color: '#525252'
  },
  captionContainer: {
    marginLeft: 8,
    marginRight: 8
  }
});

var PostFooter = React.createClass({

  propTypes: {
    post: React.PropTypes.object.isRequired,
    onStarPress: React.PropTypes.func.isRequired,
    isLikeRequestInFlight: React.PropTypes.bool,
    navigator: React.PropTypes.object.isRequired,
    onSubmitComment: React.PropTypes.func.isRequired,
    isCommentRequestInFlight: React.PropTypes.bool.isRequired
  },

  render: function() {
    var caption = <View/>;

    // TODO: Fix this crap
    if (this.props.post.caption !== '_') {
      caption = (
        <View style={styles.captionContainer}>
          <Text style={styles.caption}>
            {this.props.post.caption}
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.postFooter}>

        {caption}

        <PostStats
          navigator={this.props.navigator}
          onStarPress={this.props.onStarPress(this.props.post.liked)}
          isLikeRequestInFlight={this.props.isLikeRequestInFlight}
          post={this.props.post}/>

        <PostCommentsContainer
          postCommentsPopupComponent={PostCommentsPopup}
          post={this.props.post}
          navigator={this.props.navigator}
          onSubmitComment={this.props.onSubmitComment}
          isCommentRequestInFlight={this.props.isCommentRequestInFlight}/>

      </View>
    );
  }

});

module.exports = PostFooter;
