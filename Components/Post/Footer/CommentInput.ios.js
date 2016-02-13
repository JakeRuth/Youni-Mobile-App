'use strict';

var React = require('react-native');
var Unicycle = require('../../../Unicycle');
var postCommentsModalStore = require('../../../stores/post/PostCommentsModalStore');
var userLoginMetadataStore = require('../../../stores/UserLoginMetadataStore');
var Spinner = require('../../Common/Spinner');

var {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 6,
    marginLeft: 8,
    marginRight: 8
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#EBF7FF',
    color: '#525252',
    fontSize: 12,
    height: 25,
    paddingLeft: 6,
    paddingRight: 6,
    borderRadius: 2
  },
  postCommentButton: {
    alignSelf: 'center',
    paddingLeft: 8
  },
  postCommentButtonLabel: {
    fontSize: 12,
    color: '#0083D4'
  }
});

var CommentInput = React.createClass({

  getInitialState: function() {
    return {
      commentText: ''
    };
  },

  propTypes: {
    id: React.PropTypes.number.isRequired,
    postStore: React.PropTypes.any.isRequired,
    postIdString: React.PropTypes.string.isRequired
  },

  render: function() {
    var postCommentButton = <View/>;

    if (this.state.commentText.length > 0) {
      postCommentButton = this._renderPostCommentButton();
    }

    return (
      <View style={styles.container}>

        <TextInput
          style={styles.commentInput}
          value={this.state.commentText}
          placeholder='Add a comment...'
          placeholderTextColor='#ADADAD'
          maxLength={200}
          multiline={true}
          onChangeText={ (commentText) => {
            this.setState({
              commentText: commentText
            });
          }}/>
        {postCommentButton}

      </View>
    );
  },

  _renderPostCommentButton: function() {
    var content;
    if (this.props.postStore.isPostCommentRequestInFlight()) {
      content = (
        <Spinner/>
      );
    }
    else {
      content = (
        <TouchableHighlight
          onPress={this._onPostCommentPress}
          underlayColor='transparent'>

          <Text style={styles.postCommentButtonLabel}>
            Post
          </Text>

        </TouchableHighlight>
      );
    }

    return (
      <View style={styles.postCommentButton}>
        {content}
      </View>
    )
  },

  _onPostCommentPress: function() {
    //TODO: FIX ME BAD
    postCommentsModalStore.addComment(
      this.state.commentText,
      userLoginMetadataStore.getFirstName() + ' ' + userLoginMetadataStore.getLastName()
    );

    this.props.postStore.addCommentOnPost(
      this.props.id,
      this.props.postIdString,
      userLoginMetadataStore.getUserId(),
      this.state.commentText,
      userLoginMetadataStore.getFirstName() + ' ' + userLoginMetadataStore.getLastName(),
      () => {
        this.setState({
          commentText: ''
        });
      }
    );
  }

});

module.exports = CommentInput;
