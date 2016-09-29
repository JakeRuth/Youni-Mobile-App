'use strict';

var React = require('react');
var ReactNative = require('react-native');

var Colors = require('../../Utils/Common/Colors');

var {
  Image,
  Text,
  StyleSheet,
  Dimensions
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: 80,
    width: Dimensions.get('window').width,
    justifyContent: 'center'
  },
  name: {
    color: Colors.WHITE_SMOKE,
    fontSize: 38,
    textAlign: 'center'
  },
  description: {
    color: Colors.WHITE_SMOKE,
    fontSize: 14,
    textAlign: 'center'
  },
  textShadow: {
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 3,
    textShadowColor: Colors.DARK_TEXT_SHADOW
  }
});

var ChallengeCoverPhoto = React.createClass({

  propTypes: {
    name: React.PropTypes.string.isRequired,
    description: React.PropTypes.string.isRequired,
    photoUrl: React.PropTypes.string.isRequired
  },

  render: function() {
    return (
      <Image
        style={styles.container}
        resizeMode="cover"
        source={{uri: this.props.photoUrl}}>
        <Text style={[styles.name, styles.textShadow]}>
          {this.props.name}
        </Text>
        <Text style={[styles.description, styles.textShadow]}>
          {this.props.description}
        </Text>
      </Image>
    );
  }

});

module.exports = ChallengeCoverPhoto;
