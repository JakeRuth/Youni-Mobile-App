'use strict'

var React = require('react-native');
var Unicycle = require('../../../Unicycle');
var postCommentsModalStore = require('../../../stores/post/PostCommentsModalStore');
var userLoginMetadataStore = require('../../../stores/UserLoginMetadataStore');

var {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableHighlight,
  ActivityIndicatorIOS
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
    backgroundColor: '#F2F2F2',
    color: '#4C4C4C',
    fontSize: 14.5,
    fontWeight: '500',
    height: 32,
    paddingLeft: 6,
    paddingRight: 6
  },
  postCommentButton: {
    alignSelf: 'center',
    marginLeft: 8
  },
  postCommentButtonLabel: {
    fontSize: 14.5,
    color: '#1599ED'
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
    var that = this,
        postCommentButton = <View/>;

    if (this.state.commentText.length > 0) {
      postCommentButton = this._renderPostCommentButton();
    }

    return (
      <View style={styles.container}>

        <TextInput style={styles.commentInput}
          value={this.state.commentText}
          placeholder='Add a comment...'
          placeholderTextColor='#B2B2B2'
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
        <ActivityIndicatorIOS
          size={'small'}/>
      );
    }
    else {
      content = (
        <TouchableHighlight
          onPress={this.onPostCommentPress}
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

  onPostCommentPress: function() {
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
