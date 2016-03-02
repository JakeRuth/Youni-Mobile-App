'use strict';

var React = require('react-native');
var Unicycle = require('../../../../Unicycle');
var Spinner = require('../../../Common/Spinner');
var PostLikesPopup = require('../../../PopUpPages/PostLikesPopup');

var {
  View,
  Text,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  numLikes: {
    fontSize: 15,
    color: '#ADADAD',
    marginRight: 16,
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 10
  },
  spinnerContainer: {
    marginRight: 16
  }
});

var PostLikeText = React.createClass({

  propTypes: {
    numLikes: React.PropTypes.number.isRequired,
    postIdString: React.PropTypes.string.isRequired,
    numComments: React.PropTypes.number.isRequired,
    navigator: React.PropTypes.object.isRequired,
    loading: React.PropTypes.bool.isRequired
  },

  render: function() {
    var content;

    if (this.props.loading) {
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
          {this._getLikesText()}
        </Text>
      );
    }

    return (
      <View>
        {content}
      </View>
    );
  },

  _onTextPress: function() {
    this.props.navigator.push({
      component: PostLikesPopup,
      passProps: {postId: this.props.postIdString}
    });
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
  }

});

module.exports = PostLikeText;
