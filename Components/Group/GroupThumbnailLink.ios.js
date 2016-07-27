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
    fontSize: 10,
    fontWeight: '100'
  }
});

var GroupThumbnailLink = React.createClass({

  propTypes: {
    group: React.PropTypes.object.isRequired,
    navigator: React.PropTypes.object,
    imageStyle: React.PropTypes.any,
    labelColor: React.PropTypes.string,
    onPress: React.PropTypes.func
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
          <Text style={[styles.label, {color: this.props.labelColor}]}>
            {this.props.group.abbreviatedName}
          </Text>
        </View>

      </TouchableHighlight>
    );
  },

  _onPress: function() {
    if (this.props.navigator) {
      let GroupPopup = require('../PopupPages/GroupPopup');

      this.props.navigator.push({
        component: GroupPopup,
        passProps: {...this.props}
      });
    }
    
    if (this.props.onPress) {
      this.props.onPress();
    }
  }

});

module.exports = GroupThumbnailLink;
