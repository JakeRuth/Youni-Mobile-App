'use strict';

var React = require('react-native');

var {
  Image,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  profileImage: {
    height: 40,
    width: 40,
    borderRadius: 12
  }
});

var ProfileImageThumbnail = React.createClass({

  propTypes: {
    profileImageUrl: React.PropTypes.string
  },

  render: function() {
    return (
      <Image
        style={styles.profileImage}
        source={{uri: this.props.profileImageUrl}}/>
    );
  }

});

module.exports = ProfileImageThumbnail;
