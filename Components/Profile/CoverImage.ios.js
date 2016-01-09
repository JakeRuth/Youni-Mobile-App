'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var Unicycle = require('../../Unicycle');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

var {
  View,
  Image,
  StyleSheet,
  NativeModules,
  TouchableHighlight
} = React

var styles = StyleSheet.create({
  coverImageContainer: {
    borderColor: 'transparent',
    marginBottom: 5
  },
  coverImage: {
    height: 250
  }
});

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

  renderBlankCoverPhotoIcon: function() {
    return (
      <Icon
        name='ios-person'
        size={150}
        color='#007C9E' />
    );
  },

});

module.exports = CoverImage;
