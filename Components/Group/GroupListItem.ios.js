'use strict';

var React = require('react-native');
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

// TODO: Restyle as per Jenny's designs.  This was a copy pasta from UserListItem.ios.js
var GroupListItem = React.createClass({

  propTypes: {
    group: React.PropTypes.object.isRequired,
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
            <ProfileImageThumbnail profileImageUrl={group.mainImageUrl}/>
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
    // TODO: Create a GroupPopup and push it onto the stack here
  }

});

module.exports = GroupListItem;
