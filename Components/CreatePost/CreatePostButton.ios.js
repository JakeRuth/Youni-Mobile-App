'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Icon = require('react-native-vector-icons/MaterialIcons');

var ShowImagePicker = require('./ShowImagePicker');

var Colors = require('../../Utils/Common/Colors');

var {
  TouchableHighlight,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    width: 48,
    borderRadius: 24,
    borderColor: 'white',
    borderWidth: 1
  }
});

var CreatePostButton = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    return (
      <TouchableHighlight
        style={[styles.container, { backgroundColor: Colors.getPrimaryAppColor() }]}
        underlayColor={Colors.getPrimaryAppColor()}
        onPress={() => ShowImagePicker.showImagePicker(this.props.navigator)}>
        <Icon
          name='photo-camera'
          size={22}
          color='white'/>
      </TouchableHighlight>
    );
  }

});

module.exports = CreatePostButton;
