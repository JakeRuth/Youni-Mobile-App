'use strict';

var React = require('react');
var ReactNative = require('react-native');

var GroupActionButton = require('./GroupActionButton');
var GroupPopup = require('../PopupPages/GroupPopup');
var ProfileImageThumbnail = require('../Common/ProfileImageThumbnail');

var Colors = require('../../Utils/Common/Colors');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var UserGroupStatus = require('../../Utils/Enums/UserGroupStatus');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

var {
  View,
  Text,
  AlertIOS,
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
      description: React.PropTypes.string,
      coverImageUrl: React.PropTypes.string.isRequired,
      badgeImageUrl: React.PropTypes.string.isRequired,
      adminEmails: React.PropTypes.array,
      allTimeTrendPoints: React.PropTypes.number.isRequired,
      numPosts: React.PropTypes.number.isRequired,
      numMembers: React.PropTypes.number.isRequired,
      showLastPostTimestamp: React.PropTypes.bool
    }).isRequired,
    showQuickGroupActionButton: React.PropTypes.bool,
    navigator: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      userInGroupStatusForQuickJoin: UserGroupStatus.NOT_IN_GROUP,
      requestToJoinInFlight: false
    };
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
            {this._renderGroupActionButton()}
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

  _renderGroupActionButton: function() {
    if (this.props.showQuickGroupActionButton) {
      return (
        <GroupActionButton
          {...this.props}
          style={{
            height: 34
          }}
          userGroupStatus={this.state.userInGroupStatusForQuickJoin}
          isLoading={this.state.requestToJoinInFlight}
          useSecondaryUserGroupStatusLabel={true}
          requestToJoinGroupAction={this._requestToJoin}/>
      );
    }
  },

  _onGroupListItemPress: function() {
    this.props.navigator.push({
      component: GroupPopup,
      passProps: {...this.props}
    });
  },

  _requestToJoin: function() {
    var that = this;
    this.setState({
      requestToJoinInFlight: true
    });

    AjaxUtils.ajax(
      '/group/requestToJoin',
      {
        groupIdString: this.props.group.id,
        requestingUserEmail: userLoginMetadataStore.getEmail()
      },
      (res) => {
        that.setState({
          requestToJoinInFlight: false,
          userInGroupStatusForQuickJoin: UserGroupStatus.REQUEST_TO_JOIN_PENDING
        });
        AlertIOS.alert(
          'You have requested to join this organization!',
          'You will be notified when an admin either accepts or denies this request.',
          {
            text: 'Okay'
          }
        );
      },
      () => {
        // this should never happen... but rather do this then crash during the first use of the app
        that.setState({
          requestToJoinInFlight: false
        });
        AlertIOS.alert(
          'Could not request to join',
          'You may already be a member of this group.  If you believe this is an error please contact support@youniapp.com',
          {
            text: 'Okay'
          }
        );
      },
      true // do not retry
    );
  }

});

module.exports = GroupListItem;
