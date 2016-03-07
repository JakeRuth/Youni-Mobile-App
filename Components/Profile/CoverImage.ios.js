'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var Unicycle = require('../../Unicycle');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

var {
  View,
  Image,
  StyleSheet,
  TouchableHighlight
} = React

var styles = StyleSheet.create({
  coverImageContainer: {
    borderColor: 'transparent',
    marginBottom: 5
  },
  coverImage: {
    height: 125
  }
});

// DEPRECATED
// This component is currently unused due to the re-design effort when Sean left
// I decided to keep it around if we decide to re introduce this in the future
var CoverImage = React.createClass({

  propTypes: {
    viewerIsProfileOwner: React.PropTypes.bool.isRequired,
    coverImageUrl: React.PropTypes.string
  },

  render: function() {
    var content;

    if (this.props.coverImageUrl) {
      content = this.renderCoverImage();
    }
    else {
      content = this.renderBlankCoverPhotoIcon();
    }

    return (
      <View style={styles.coverImageContainer}>
        {content}
      </View>
    );
  },

  renderCoverImage: function() {
    return (
      <TouchableHighlight onPress={this._onUploadImagePress}>
        <Image style={styles.coverImage}
               source={{uri: this.props.coverImageUrl}} />
      </TouchableHighlight>
    );
  },

  //TODO: This may be able to be deleted after profile page is fully redesigned
  renderBlankCoverPhotoIcon: function() {
    return (
      <Icon
        name='ios-person'
        size={150}
        color='#5d6aff' />
    );
  },

});

module.exports = CoverImage;
