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
  profileImageContainer: {
    borderColor: 'transparent',
    borderWidth: 4,
    marginBottom: 5
  },
  profileImage: {
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
      content = this.renderProfileImage();
    }
    else {
      content = this.renderBlankProfileIcon();
    }

    return (
      <View style={styles.profileImageContainer}>
        {content}
      </View>
    );
  },

  renderProfileImage: function() {
    return (
      <TouchableHighlight onPress={this._onUploadImagePress}>
        <Image style={styles.profileImage}
               source={{uri: this.props.coverImageUrl}} />
      </TouchableHighlight>
    );
  },

  renderBlankProfileIcon: function() {
    return (
      <Icon
        name='ios-person'
        size={150}
        color='#007C9E' />
    );
  },

});

module.exports = CoverImage;
