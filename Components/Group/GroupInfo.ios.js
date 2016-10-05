'use strict';

var React = require('react');
var ReactNative = require('react-native');

var GroupStats = require('./GroupStats');
var GroupActionButton = require('./GroupActionButton');
var EditGroupButton = require('./Admin/Edit/EditGroupButton');
var GroupUsersPopup = require('../PopupPages/GroupUsersPopup');

var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var Colors = require('../../Utils/Common/Colors');
var GroupUtils = require('../../Utils/Group/GroupUtils');
var UserGroupStatus = require('../../Utils/Enums/UserGroupStatus');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

var {
  View,
  Image,
  Text,
  AlertIOS,
  StyleSheet,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  coverImage: {
    flex: 1,
    height: 125
  },
  name: {
    color: Colors.DARK_GRAY,
    textAlign: 'center',
    fontWeight: '300',
    fontSize: 17,
    paddingTop: 10
  },
  description: {
    color: Colors.DARK_GRAY,
    fontWeight: '200',
    fontSize: 12,
    padding: 20,
    paddingTop: 2
  },
  editGroupButtonContainer: {
    alignItems: 'center',
    marginBottom: 12
  },
  groupStatsContainer: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  stat: {
    flex: 1
  },
  statValue: {
    fontSize: 18,
    fontWeight: '300',
    textAlign: 'center'
  },
  statLabel: {
    fontSize: 11,
    textAlign: 'center'
  },
  statSeparator: {
    backgroundColor: Colors.LIGHT_GRAY,
    height: 36,
    width: 2
  },
  groupInviteCodeContainer: {
    justifyContent: 'center',
    backgroundColor: Colors.WHITE_SMOKE,
    height: 32
  },
  groupInviteCode: {
    fontSize: 16,
    textAlign: 'center'
  }
});

var GroupInfo = React.createClass({

  getInitialState: function() {
    return {
      userGroupStatus: null,
      loadingUserInGroupStatus: true,
      requestToJoinInFlight: false
    };
  },

  componentDidMount: function() {
    this._requestUserGroupStatus();
  },

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
      numMembers: React.PropTypes.number.isRequired
    }).isRequired,
    onPageReturnCallback: React.PropTypes.func.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    return (
      <View style={styles.container}>

        <Image
          style={styles.coverImage}
          resizeMode="cover"
          source={{uri: this.props.group.coverImageUrl}}/>

        <Text style={styles.name}>
          {this.props.group.name}
        </Text>
        <Text style={styles.description}>
          {this.props.group.description}
        </Text>

        <View style={styles.groupStatsContainer}>
          <TouchableHighlight
            style={[styles.stat, styles.leftStat]}
            underlayColor="transparent">
            <View>
              <Text style={styles.statValue}>
                {this.props.group.numPosts}
              </Text>
              <Text style={styles.statLabel}>
                Posts
              </Text>
            </View>
          </TouchableHighlight>
          <View style={styles.statSeparator}/>
          <TouchableHighlight
            style={[styles.stat, styles.rightStat]}
            underlayColor="transparent"
            onPress={this._onMembersStatPress}>
            <View>
              <Text style={styles.statValue}>
                {this.props.group.numMembers}
              </Text>
              <Text style={styles.statLabel}>
                Members
              </Text>
            </View>
          </TouchableHighlight>
        </View>

        {this._renderGroupActionButton()}
        {this._renderGroupInviteCode()}

      </View>
    );
  },

  _renderGroupActionButton: function() {
    if (GroupUtils.isUserAdmin(this.props.group, userLoginMetadataStore.getEmail())) {
      return (
        <View style={styles.editGroupButtonContainer}>
          <EditGroupButton {...this.props}/>
        </View>
      );
    }
    else if (this.props.group.allowJoinRequests) {
      return (
        <View style={{alignItems: 'center'}}>
          <GroupActionButton
            {...this.props}
            style={{
              width: 160,
              height: 34,
              marginBottom: 12,
              alignItems: 'center'
            }}
            userGroupStatus={this.state.userGroupStatus}
            isLoading={this.state.loadingUserInGroupStatus || this.state.requestToJoinInFlight}
            requestToJoinGroupAction={this.requestToJoin}/>
        </View>
      );
    }
  },

  _renderGroupInviteCode: function() {
    var doesInviteCodeExist = this.props.group && this.props.group.inviteCode;
    var isUserInGroup = this.state.userGroupStatus === UserGroupStatus.IN_GROUP || this.state.userGroupStatus === UserGroupStatus.IS_ADMIN;

    if (doesInviteCodeExist && isUserInGroup) {
      return (
        <View style={styles.groupInviteCodeContainer}>
          <Text style={[styles.groupInviteCode, { color: Colors.getPrimaryAppColor() }]}>
            {`Organization Code: ${this.props.group.inviteCode}`}
          </Text>
        </View>
      );
    }
  },

  _onMembersStatPress: function() {
    this.props.navigator.push({
      component: GroupUsersPopup,
      passProps: {
        group: this.props.group
      }
    })
  },

  _requestUserGroupStatus: function() {
    if (!this.props.group.allowJoinRequests) {
      return;
    }
    
    var that = this;
    this.setState({
      loadingUserInGroupStatus: true
    });
    
    AjaxUtils.ajax(
      '/group/getUsersJoinStatus',
      {
        groupIdString: this.props.group.id,
        userEmail: userLoginMetadataStore.getEmail()
      },
      (res) => {
        let status = UserGroupStatus.getById(res.body.status);

        that.setState({
          loadingUserInGroupStatus: false,
          userGroupStatus: status
        });
      },
      () => {
        that.setState({
          loadingUserInGroupStatus: false
        });
      }
    );
  },
  
  requestToJoin: function() {
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
          userGroupStatus: UserGroupStatus.REQUEST_TO_JOIN_PENDING
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
        that.setState({
          requestToJoinInFlight: false
        });
      }
    );
  }

});

module.exports = GroupInfo;
