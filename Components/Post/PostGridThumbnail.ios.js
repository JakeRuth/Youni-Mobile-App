'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var Icon = require('react-native-vector-icons/Ionicons');
var PostPopup = require('../PopupPages/PostPopup');
var Emoji = require('../Common/Emoji');
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
  posterProfileImage: {
    top: 2,
    left: 2,
    height: 27,
    width: 27,
    borderRadius: 13.5,
    borderWidth: 1,
    borderColor: 'lightgray'
  },
  fireIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    opacity: .75
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
    var fireIcon;

    if (!this.props.post) {
      return <View style={styles.blankPostPlaceholder}/>;
    }
    else {
      return this._renderThumbnail();
    }
  },

  _renderThumbnail: function() {
    var fireIcon;

    if (this.props.post.isPostUserCurrentlyTrending) {
      fireIcon = (
        <View style={styles.fireIcon}>
          <Emoji
            name="fire"
            size={25}/>
        </View>
      );
    }

    return (
      <TouchableHighlight
        style={styles.container}
        underlayColor='transparent'
        onPress={this._onPostClick}>

        <View>
          <Image
            style={styles.image}
            source={{uri: this.props.post.photoUrl}}>

            <Image
              style={styles.posterProfileImage}
              source={{uri: this.props.post.posterProfileImageUrl}}/>

          </Image>
          {fireIcon}
        </View>

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

    if (email !== this.props.post.posterEmail) {
      Unicycle.exec('triggerPostView', email, this.props.post.postIdString, this.props.post.id);
    }
  }

});

module.exports = PostGridThumbnail;
