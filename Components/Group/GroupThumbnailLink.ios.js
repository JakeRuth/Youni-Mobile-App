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
    onPress: React.PropTypes.func,
    hideLabel: React.PropTypes.bool
  },

  render: function() {
    return (
      <TouchableHighlight
        style={this.props.style}
        underlayColor="transparent"
        onPress={this._onPress}>

        <View>
          <ProfileImageThumbnail
            style={this.props.imageStyle}
            profileImageUrl={this.props.group.badgeImageUrl}/>
          {this._renderLabel()}
        </View>

      </TouchableHighlight>
    );
  },
  
  _renderLabel: function() {
    if (!this.props.hideLabel) {
      return (
        <Text style={styles.label}>
          {this.props.group.abbreviatedName}
        </Text>
      );
    }
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
