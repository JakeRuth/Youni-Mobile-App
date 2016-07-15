'use strict';

var React = require('react-native');

var ProfileImageThumbnail = require('../../Common/ProfileImageThumbnail');

var Colors = require('../../../Utils/Common/Colors');
var userLoginMetadataStore = require('../../../stores/UserLoginMetadataStore');

var {
  View,
  Text,
  StyleSheet,
  ActionSheet,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  container: {
    paddingTop: 11,
    paddingBottom: 11
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  name: {
    color: Colors.DARK_GRAY,
    fontSize: 16,
    fontWeight: '300',
    marginLeft: 20
  }
});

var ManageGroupUserListItem = React.createClass({

  propTypes: {
    user: React.PropTypes.object.isRequired,
    displayNameOverride: React.PropTypes.string
  },

  render: function() {
    return (
      <TouchableHighlight
        style={styles.container}
        underlayColor="transparent">

        <View style={styles.userInfoContainer}>
          <ProfileImageThumbnail profileImageUrl={this.props.user.profileImageUrl}/>
          <Text style={styles.name}>
            {this._getUserDisplayName()}
          </Text>
        </View>

      </TouchableHighlight>
    );
  },

  _getUserDisplayName: function() {
    if (this.props.displayNameOverride) {
      return this.props.displayNameOverride;
    }
    else if (userLoginMetadataStore.getEmail() === this.props.user.email) {
      return 'Me';
    }
    else {
      return this.props.user.firstName + ' ' + this.props.user.lastName;
    }
  }

});

module.exports = ManageGroupUserListItem;
