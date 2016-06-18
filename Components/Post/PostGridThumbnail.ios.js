'use strict';

var React = require('react-native');
var PostPopup = require('../PopupPages/PostPopup');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

var {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 1
  },
  image: {
    flex: 1,
    alignSelf: 'stretch',
    height: 133.33
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
    var email = userLoginMetadataStore.getEmail();

    this.props.navigator.push({
      component: PostPopup,
      passProps: {
        post: this.props.post,
        clickedFromExploreFeed: true
      }
    });
  }

});

module.exports = PostGridThumbnail;
