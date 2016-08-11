'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Icon = require('react-native-vector-icons/MaterialIcons');
var Colors = require('../../Utils/Common/Colors');
var Spinner = require('../Common/Spinner');

var {
  View,
  Image,
  StyleSheet,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  profileImageContainer: {
    width: 100,
    height: 100
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 24
  },
  icon: {
    marginTop: 25
  }
});

var ProfileImage = React.createClass({

  propTypes: {
    user: React.PropTypes.object.isRequired,
    imageOverrideUrl: React.PropTypes.string,
    onPress: React.PropTypes.func,
    isUploading: React.PropTypes.bool
  },

  render: function() {
    var content;

    if (this.props.isUploading) {
      content = (
        <Spinner/>
      );
    }
    else if (this.props.imageOverrideUrl) {
      content = (
        <Image
          style={styles.profileImage}
          source={{uri: this.props.imageOverrideUrl}}/>
      );
    }
    else if (this.props.user.profileImageUrl) {
      content = (
        <Image
          style={styles.profileImage}
          source={{uri: this.props.user.profileImageUrl}}/>
      );
    }
    else {
      content = (
        <Icon
          style={styles.icon}
          name='person'
          size={100}
          color={Colors.getPrimaryAppColor()}/>
      );
    }

    return (
      <TouchableHighlight
        style={styles.profileImageContainer}
        underlayColor='transparent'
        onPress={this.props.onPress}>
        <View>
          {content}
        </View>
      </TouchableHighlight>
    );
  }

});

module.exports = ProfileImage;
