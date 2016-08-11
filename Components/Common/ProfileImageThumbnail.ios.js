'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');

var Colors = require('../../Utils/Common/Colors');

var {
  View,
  Image,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  profileImage: {
    height: 48,
    width: 48,
    borderRadius: 12
  },
  noProfilePictureIcon: {
    width: 48,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

var ProfileImageThumbnail = React.createClass({

  propTypes: {
    profileImageUrl: React.PropTypes.string
  },

  render: function() {
    if (this.props.profileImageUrl) {
      return (
        <Image
          style={[styles.profileImage, this.props.style]}
          source={{uri: this.props.profileImageUrl}}/>
      );
    }
    else {
      return (
        <View style={[styles.noProfilePictureIcon, this.props.style]}>
          <Icon
            name='ios-person'
            size={40}
            color={Colors.getPrimaryAppColor()} />
        </View>
      );
    }
  }

});

module.exports = ProfileImageThumbnail;
