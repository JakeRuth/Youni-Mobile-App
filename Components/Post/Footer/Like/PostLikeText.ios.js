'use strict';

var React = require('react-native');
var Unicycle = require('../../../../Unicycle');
var postLikeModalStore = require('../../../../stores/post/like/PostLikeModalStore');
var PostLikeModal = require('./PostLikeModal');
var Spinner = require('../../../Common/Spinner');

var {
  View,
  Text,
  StyleSheet
} = React

var styles = StyleSheet.create({
  numLikes: {
    fontSize: 13,
    color: '#ADADAD',
    marginRight: 16
  },
  spinnerContainer: {
    marginRight: 16
  }
});

var PostLikeText = React.createClass({

  propTypes: {
    postStore: React.PropTypes.any.isRequired,
    numLikes: React.PropTypes.number.isRequired,
    postIdString: React.PropTypes.string.isRequired,
    numComments: React.PropTypes.number.isRequired
  },

  render: function() {
    var content;

    if (this.props.postStore.isLikeRequestInFlight()) {
      content = (
        <View style={styles.spinnerContainer}>
          <Spinner/>
        </View>
      );
    }
    else {
      content = (
        <Text style={styles.numLikes}
            onPress={this._onTextPress}>
          {this._getCommentsText()}   {this._getLikesText()}
        </Text>
      );
    }

    return (
      <View>
        <PostLikeModal postIdString={this.props.postIdString}/>
        {content}
      </View>
    );
  },

  _onTextPress: function() {
    Unicycle.exec('setIsModalVisible', true);
    Unicycle.exec('getLikersForPost', this.props.postIdString);
  },

  //TODO: this should be handled by the api
  _getLikesText() {
    if (this.props.numLikes > 1) {
      return this.props.numLikes + ' likes';
    }
    else if (this.props.numLikes === 1) {
      return this.props.numLikes + ' like';
    }
    else {
      return '';
    }
  },

  _getCommentsText() {
    if (this.props.numComments > 1) {
      return this.props.numComments + ' comments';
    }
    else if (this.props.numComments === 1) {
      return this.props.numComments + ' comment';
    }
    else {
      return '';
    }
  }

});

module.exports = PostLikeText;
