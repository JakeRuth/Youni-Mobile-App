'use strict'

var React = require('react-native');
var Unicycle = require('../../../Unicycle');

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
    return (
      <TouchableHighlight
        style={styles.postCommentButton}
        onPress={()=>{}}
        underlayColor='transparent'>

        <Text style={styles.postCommentButtonLabel}>
          Post
        </Text>

      </TouchableHighlight>
    );
  }

});

module.exports = CommentInput;
