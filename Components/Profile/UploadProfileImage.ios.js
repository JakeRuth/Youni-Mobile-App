'use strict';

var React = require('react-native');

var {
  TouchableHighlight,
  Text,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  uploadProfileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: .5,
    borderColor: 'maroon'
  },
  uploadProfileImageText: {
    marginTop: 25,
    backgroundColor: 'transparent',
    textAlign: 'center',
    padding: 5,
    color: 'maroon'
  }
});

var UploadProfileImage = React.createClass({

  propTypes: {
    onUploadPhotoPress: React.PropTypes.func.isRequired
  },

  render: function() {
    return (
      <TouchableHighlight
        style={styles.uploadProfileImageContainer}
        underlayColor={'transparent'}
        onPress={this.props.onUploadPhotoPress}>

        <Text style={styles.uploadProfileImageText}>
          Upload Profile Photo
        </Text>

      </TouchableHighlight>
    );
  }

});

module.exports = UploadProfileImage;
