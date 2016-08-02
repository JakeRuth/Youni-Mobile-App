'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');

var Colors = require('../../Utils/Common/Colors');

var {
  View,
  Image,
  StyleSheet
} = React;

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
          style={styles.profileImage}
          source={{uri: this.props.profileImageUrl}}/>
      );
    }
    else {
      return (
        <View style={[styles.noProfilePictureIcon, this.props.style]}>
          <Icon
            name='ios-person'
            size={40}
            color={Colors.YOUNI_PRIMARY} />
        </View>
      );
    }
  }

});

module.exports = ProfileImageThumbnail;
