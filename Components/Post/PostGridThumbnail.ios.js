'use strict';

var React = require('react');
var ReactNative = require('react-native');
var PostPopup = require('../PopupPages/PostPopup');
var Colors = require('../../Utils/Common/Colors');

var {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    margin: 1,
    width: Dimensions.get('window').width / 3
  },
  image: {
    height: Dimensions.get('window').width / 3,
    width: Dimensions.get('window').width / 3
  }
});

var PostGridThumbnail = React.createClass({

  propTypes: {
    post: React.PropTypes.object.isRequired,
    likePhotoAction: React.PropTypes.func,
    unlikePhotoAction: React.PropTypes.func,
    onSubmitCommentAction: React.PropTypes.func,
    onDeleteCommentAction: React.PropTypes.func.isRequired,
    navigator: React.PropTypes.object,
    onPress: React.PropTypes.func,
    renderedFromProfileView: React.PropTypes.bool
  },

  render: function() {
    return (
      <TouchableHighlight
        style={styles.container}
        underlayColor='transparent'
        onPress={this._onPostClick}>

        <Image
          style={styles.image}
          resizeMode="cover"
          source={{uri: this.props.post.photoUrl}}/>

      </TouchableHighlight>
    );
  },

  _onPostClick: function() {
    if (this.props.onPress) {
      this.props.onPress();
    }
    else {
      this.props.navigator.push({
        component: PostPopup,
        passProps: {...this.props}
      });
    }
  }

});

module.exports = PostGridThumbnail;
