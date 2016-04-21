'use strict';

var React = require('react-native');
var Unicycle = require('../../../Unicycle');
var userLoginMetadataStore = require('../../../stores/UserLoginMetadataStore');
var Spinner = require('../../Common/Spinner');
var Color = require('../../../Utils/Common/GlobalColorMap');

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
    alignSelf: 'center'
  },
  postCommentButtonLabel: {
    fontSize: 15,
    color: Color.YOUNI_PRIMARY_PURPLE,
    textAlign: 'center',
    padding: 5
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
    postIdString: React.PropTypes.string.isRequired,
    onSubmitComment: React.PropTypes.func.isRequired,
    isCommentRequestInFlight: React.PropTypes.bool.isRequired,
    commentInputAutoFocus: React.PropTypes.bool
  },

  render: function() {
    var postCommentButton = <View/>;

    if (this.state.commentText.length > 0 || this.props.isCommentRequestInFlight) {
      postCommentButton = this._renderPostCommentButton();
    }

    return (
      <View style={styles.container}>

        <TextInput
          style={styles.commentInput}
          value={this.state.commentText}
          placeholder='Add a comment...'
          placeholderTextColor='#ADADAD'
          maxLength={2000}
          multiline={true}
          keyboardType='twitter'
          autoFocus={true}
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
    if (this.props.isCommentRequestInFlight) {
      content = (
        <Spinner/>
      );
    }
    else {
      content = (
        <TouchableHighlight
          onPress={() => {
            this.props.onSubmitComment(this.state.commentText);
            this.setState({
              commentText: ''
            });
          }}
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
  }

});

module.exports = CommentInput;
