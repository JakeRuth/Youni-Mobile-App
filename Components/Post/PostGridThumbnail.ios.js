'use strict';

var React = require('react-native');
var PostPopup = require('../PopupPages/PostPopup');
var Colors = require('../../Utils/Common/Colors');

var {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableHighlight
} = React;

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
    // If a post isn't passed in, just render a blank box.  Ex: Blocked users lead to post.size < page size
    post: React.PropTypes.object.isRequired,
    likePhotoAction: React.PropTypes.func.isRequired,
    unlikePhotoAction: React.PropTypes.func.isRequired,
    onSubmitCommentAction: React.PropTypes.func.isRequired,
    navigator: React.PropTypes.object.isRequired
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
    this.props.navigator.push({
      component: PostPopup,
      passProps: {...this.props}
    });
  }

});

module.exports = PostGridThumbnail;
