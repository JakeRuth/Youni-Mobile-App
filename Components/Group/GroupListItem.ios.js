'use strict';

var React = require('react-native');
var GroupPopup = require('../PopupPages/GroupPopup');
var ProfileImageThumbnail = require('../Common/ProfileImageThumbnail');
var Colors = require('../../Utils/Common/Colors');

var {
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 55
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: '100',
    alignSelf: 'center',
    color: Colors.DARK_GRAY,
    paddingLeft: 16
  }
});

var GroupListItem = React.createClass({

  propTypes: {
    group: React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      name: React.PropTypes.string.isRequired,
      description: React.PropTypes.string.isRequired,
      coverImageUrl: React.PropTypes.string.isRequired,
      badgeImageUrl: React.PropTypes.string.isRequired,
      adminEmails: React.PropTypes.array,
      allTimeTrendPoints: React.PropTypes.number.isRequired,
      numPosts: React.PropTypes.number.isRequired,
      numMembers: React.PropTypes.number.isRequired
    }).isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    var group = this.props.group;

    return (
      <View style={this.props.style}>
        <TouchableHighlight
          underlayColor='transparent'
          onPress={() => { this._onGroupListItemPress(group.email); }}>

          <View style={styles.container}>
            <ProfileImageThumbnail profileImageUrl={group.badgeImageUrl}/>
            <Text
              style={styles.name}
              numberOfLines={1}>
              {group.name}
            </Text>
          </View>

        </TouchableHighlight>
      </View>
    );
  },

  _onGroupListItemPress: function(email) {
    this.props.navigator.push({
      component: GroupPopup,
      passProps: {
        ...this.props
      }
    })
  }

});

module.exports = GroupListItem;
