'use strict';

var React = require('react');
var ReactNative = require('react-native');
var CommentList = require('./Footer/CommentList');
var CommentInput = require('./Footer/CommentInput');
var LoadMoreButton = require('../Common/LoadMoreButton');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var PostUtils = require('../../Utils/Post/PostUtils');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

var {
  View,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    marginLeft: 8,
    marginRight: 8
  }
});

var PostCommentsPage = React.createClass({

  propTypes: {
    loading: React.PropTypes.bool,
    post: React.PropTypes.object.isRequired,
    comments: React.PropTypes.array.isRequired,
    moreToFetch: React.PropTypes.bool.isRequired,
    navigator: React.PropTypes.object.isRequired,
    commentInputAutoFocus: React.PropTypes.bool,
    onLoadMorePress: React.PropTypes.func.isRequired,
    onSubmitCommentAction: React.PropTypes.func.isRequired,
    onSubmitCommentCallback: React.PropTypes.func.isRequired
  },

  getInitialState: function() {
    return {
      isCommentRequestInFlight: false
    };
  },

  render: function() {
    return (
      <View style={styles.container}>

        <CommentList
          comments={this.props.comments}
          navigator={this.props.navigator}/>

        <LoadMoreButton
          onPress={this.props.onLoadMorePress}
          isLoading={this.props.loading}
          isVisible={this.props.moreToFetch}/>

        <CommentInput
          id={this.props.post.id}
          postIdString={this.props.post.postIdString}
          onSubmitCommentAction={this._onSubmitComment}
          isCommentRequestInFlight={this.state.isCommentRequestInFlight}
          commentInputAutoFocus={this.props.commentInputAutoFocus}/>
      </View>
    );
  },

  _onSubmitComment: function(comment) {
    var that = this,
        userId = userLoginMetadataStore.getUserId(),
        callback = () => {
          this.props.onSubmitCommentCallback(comment);
          this.setState({
            isCommentRequestInFlight: false
          });
        };

    this.setState({
      isCommentRequestInFlight: true
    });
    this.props.onSubmitCommentAction(comment, this.props.post, callback);
  }

});

module.exports = PostCommentsPage;
