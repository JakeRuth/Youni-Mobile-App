'use strict';

var React = require('react-native');

var ProfileImageThumbnail = require('../Common/ProfileImageThumbnail');

var Colors = require('../../Utils/Common/Colors');

var {
  View,
  Text,
  TouchableHighlight,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  label: {
    marginTop: 1,
    color: Colors.DARK_GRAY,
    textAlign: 'center',
    fontSize: 12
  }
});

var GroupThumbnailLink = React.createClass({

  propTypes: {
    group: React.PropTypes.object.isRequired,
    navigator: React.PropTypes.object,
    imageStyle: React.PropTypes.any,
    onPress: React.PropTypes.func
  },

  render: function() {
    return (
      <TouchableHighlight
        style={this.props.style}
        underlayColor="transparent"
        onPress={this._onPress}>

        <View>
          <ProfileImageThumbnail profileImageUrl={this.props.group.badgeImageUrl}/>
          <Text style={styles.label}>
            {this.props.group.abbreviatedName}
          </Text>
        </View>

      </TouchableHighlight>
    );
  },

  _onPress: function() {
    if (this.props.onPress) {
      this.props.onPress();
    }
    
    if (this.props.navigator) {
      let GroupPopup = require('../PopupPages/GroupPopup');

      this.props.navigator.push({
        component: GroupPopup,
        passProps: {...this.props}
      });
    }
  }

});

module.exports = GroupThumbnailLink;
