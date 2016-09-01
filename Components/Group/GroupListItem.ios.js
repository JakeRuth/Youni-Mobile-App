'use strict';

var React = require('react');
var ReactNative = require('react-native');

var GroupPopup = require('../PopupPages/GroupPopup');
var ProfileImageThumbnail = require('../Common/ProfileImageThumbnail');

var Colors = require('../../Utils/Common/Colors');

var {
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10
  },
  nameAndTimestampContainer: {
    flex: 1
  },
  name: {
    flex: 1,
    fontSize: 16,
    color: Colors.DARK_GRAY,
    paddingLeft: 16
  },
  timestamp: {
    fontSize: 16,
    paddingLeft: 16,
    color: Colors.MED_GRAY
  }
});

var GroupListItem = React.createClass({

  propTypes: {
    group: React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      name: React.PropTypes.string.isRequired,
      abbreviatedName: React.PropTypes.string.isRequired,
      description: React.PropTypes.string.isRequired,
      coverImageUrl: React.PropTypes.string.isRequired,
      badgeImageUrl: React.PropTypes.string.isRequired,
      adminEmails: React.PropTypes.array,
      allTimeTrendPoints: React.PropTypes.number.isRequired,
      numPosts: React.PropTypes.number.isRequired,
      numMembers: React.PropTypes.number.isRequired,
      showLastPostTimestamp: React.PropTypes.bool
    }).isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    var group = this.props.group;

    return (
      <View style={this.props.style}>
        <TouchableHighlight
          underlayColor='transparent'
          onPress={() => this._onGroupListItemPress(group.email)}>

          <View style={styles.container}>
            <ProfileImageThumbnail profileImageUrl={group.badgeImageUrl}/>
            {this._renderBody(group)}
          </View>

        </TouchableHighlight>
      </View>
    );
  },

  _renderBody: function(group) {
    if (this.props.showLastPostTimestamp) {
      return (
        <View style={styles.nameAndTimestampContainer}>
          <Text
            style={styles.name}
            numberOfLines={1}>
            {group.name}
          </Text>
          <Text style={styles.timestamp}>
            {group.lastPostAdded ? group.lastPostAdded : group.updated}
          </Text>
        </View>
      );
    }
    else {
      return (
        <Text
          style={styles.name}
          numberOfLines={1}>
          {group.name}
        </Text>
      );
    }
  },

  _onGroupListItemPress: function() {
    this.props.navigator.push({
      component: GroupPopup,
      passProps: {...this.props}
    });
  }

});

module.exports = GroupListItem;
