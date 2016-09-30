'use strict';

var React = require('react');
var ReactNative = require('react-native');

var CampusChallengePopup = require('../PopupPages/CampusChallengePopup');

var Colors = require('../../Utils/Common/Colors');

var {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    width: 180,
    height: 60,
    marginLeft: 12,
    borderRadius: 8
  },
  labelContainer: {
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  label: {
    color: 'white',
    fontSize: 14,
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 3,
    textShadowColor: Colors.DARK_TEXT_SHADOW
  }
});

var PastChallengeBannerListItem = React.createClass({

  propTypes: {
    challenge: React.PropTypes.object.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    return (
      <TouchableHighlight
        underlayColor="transparent"
        onPress={() =>{
          this.props.navigator.push({
            component: CampusChallengePopup,
            passProps: {...this.props}
          })
        }}>
        <Image
          style={styles.container}
          resizeMode="cover"
          source={{uri: this.props.challenge.coverPhotoUrl}}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>
              {this.props.challenge.name}
            </Text>
          </View>
        </Image>
      </TouchableHighlight>
    );
  }

});

module.exports = PastChallengeBannerListItem;
