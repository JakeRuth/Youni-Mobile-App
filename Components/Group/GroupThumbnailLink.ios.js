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
  container: {
    paddingLeft: 10
  },
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
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    return (
      <TouchableHighlight
        underlayColor="transparent"
        onPress={this._onPress}>

        <View style={styles.container}>
          <ProfileImageThumbnail profileImageUrl={this.props.group.badgeImageUrl}/>
          <Text style={styles.label}>
            {this.props.group.abbreviatedName}
          </Text>
        </View>

      </TouchableHighlight>
    );
  },

  _onPress: function(email) {
    var GroupPopup = require('../PopupPages/GroupPopup');

    this.props.navigator.push({
      component: GroupPopup,
      passProps: {
        ...this.props
      }
    })
  }

});

module.exports = GroupThumbnailLink;
