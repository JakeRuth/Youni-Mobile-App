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
    user: React.PropTypes.object.isRequired,
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
          name='ios-person'
          size={150}
          color={Colors.FADED_YOUNI_PRIMARY}/>
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
