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
    margin: 2
  },
  image: {
    resizeMode: "cover",
    height: Dimensions.get('window').width / 3,
    width: Dimensions.get('window').width / 3
  },
  blankPostPlaceholder: {
    // divide by three since we display three posts across on the feed
    width: Dimensions.get('window').width / 3
  }
});

var PostGridThumbnail = React.createClass({

  propTypes: {
    // If a post isn't passed in, just render a blank box.  Ex: Blocked users lead to post.size < page size
    post: React.PropTypes.object,
    likePhotoAction: React.PropTypes.func.isRequired,
    unlikePhotoAction: React.PropTypes.func.isRequired,
    onSubmitCommentAction: React.PropTypes.func.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    if (!this.props.post) {
      return <View style={styles.blankPostPlaceholder}/>;
    }
    else {
      return this._renderThumbnail();
    }
  },

  _renderThumbnail: function() {
    return (
      <TouchableHighlight
        style={styles.container}
        underlayColor='transparent'
        onPress={this._onPostClick}>

        <Image
          style={styles.image}
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
