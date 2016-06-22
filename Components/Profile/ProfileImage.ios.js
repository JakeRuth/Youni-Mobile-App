'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var Colors = require('../../Utils/Common/Colors');
var Spinner = require('../Common/Spinner');

var {
  View,
  Image,
  StyleSheet,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  profileImageContainer: {
    width: 100,
    height: 100
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 24
  }
});

var ProfileImage = React.createClass({

  propTypes: {
    profileImageUrl: React.PropTypes.string,
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
    else if (this.props.profileImageUrl) {
      content = (
        <Image
          style={styles.profileImage}
          source={{uri: this.props.profileImageUrl}}/>
      );
    }
    else {
      content = (
        <Icon
          name='ios-person'
          size={150}
          color={Colors.FADED_YOUNI_PRIMARY_PURPLE}/>
      );
    }

    return (
      <TouchableHighlight
        style={styles.profileImageContainer}
        underlayColor='transparent'
        onPress={this.props.onPress}>
        {content}
      </TouchableHighlight>
    );
  }

});

module.exports = ProfileImage;
