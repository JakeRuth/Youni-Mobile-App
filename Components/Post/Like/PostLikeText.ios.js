'use strict';

var React = require('react-native');
var Unicycle = require('../../../Unicycle');
var postLikeModalStore = require('../../../stores/post/like/PostLikeModalStore');
var PostLikeModal = require('./PostLikeModal')

var {
  View,
  Text,
  StyleSheet,
  ActivityIndicatorIOS
} = React

var styles = StyleSheet.create({
  numLikes: {
    color: 'darkblue',
    fontSize: 18,
    marginLeft: 25,
    fontFamily: 'Avenir'
  }
});

var PostLikeText = React.createClass({

  propTypes: {
    postStore: React.PropTypes.any.isRequired,
    numLikes: React.PropTypes.number.isRequired,
    postIdString: React.PropTypes.string.isRequired
  },

  render: function() {
    var content;

    if (this.props.postStore.isLikeRequestInFlight()) {
      content = this._renderSmallSpinner();
    }
    else {
      content = (
        <Text style={styles.numLikes}
            onPress={this._onTextPress}>
          {this._getLikesText(this.props.numLikes)}
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

  _renderSmallSpinner: function() {
    return (
      <ActivityIndicatorIOS size={'small'} style={styles.spinner}/>
    );
  },

  //TODO: this should be handled by the api
  _getLikesText(numLikes) {
    if (numLikes > 1) {
      return numLikes + ' likes';
    }
    else if (numLikes === 1) {
      return numLikes + ' like';
    }
    else {
      return 'no likes... yet';
    }
  }

});

module.exports = PostLikeText;
