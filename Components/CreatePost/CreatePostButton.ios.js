'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');

var ShowImagePicker = require('./ShowImagePicker');

var Colors = require('../../Utils/Common/Colors');

var {
  TouchableHighlight,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.YOUNI_PRIMARY_PURPLE,
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
        style={styles.container}
        underlayColor={Colors.YOUNI_PRIMARY_PURPLE}
        onPress={() => ShowImagePicker.showImagePicker(this.props.navigator)}>
        <Icon
          name='android-camera'
          size={22}
          color='white'/>
      </TouchableHighlight>
    );
  }

});

module.exports = CreatePostButton;
