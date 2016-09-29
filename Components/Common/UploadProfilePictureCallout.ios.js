'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Icon = require('react-native-vector-icons/MaterialIcons');

var Colors = require('../../Utils/Common/Colors');
var AlignCallout = require('../../Utils/Enums/AlignCallout');

var {
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: Colors.LOUD_RED,
    borderRadius: 6
  },
  label: {
    flex: 1,
    alignSelf: 'center',
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    padding: 8,
    backgroundColor: 'transparent'
  },
  arrow: {
    position: 'absolute',
    backgroundColor: 'transparent'
  }
});

var UploadProfilePictureCallout = React.createClass({

  propTypes: {
    isVisible: React.PropTypes.bool,
    align: React.PropTypes.oneOf([
      AlignCallout.TOP_RIGHT
    ]).isRequired,
    onPress: React.PropTypes.func.isRequired
  },

  render: function() {
    if (this.props.isVisible) {
      return (
        <TouchableHighlight
          style={styles.container}
          underlayColor={Colors.LOUD_RED}
          onPress={this.props.onPress}>

          <View style={{flex: 1}}>
            <Text style={styles.label}>
              Upload Profile Picture
            </Text>
            <Icon
              style={[styles.arrow, this.props.align]}
              name='arrow-drop-up'
              size={50}
              color={Colors.LOUD_RED}/>
          </View>
          
        </TouchableHighlight>
      );
    }
    else {
      return <View/>;
    }
  }

});

module.exports = UploadProfilePictureCallout;
