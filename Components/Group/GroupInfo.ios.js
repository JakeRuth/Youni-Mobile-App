'use strict';

var React = require('react');
var ReactNative = require('react-native');

var GroupStats = require('./GroupStats');
var GroupActionButton = require('./GroupActionButton');
var EditGroupButton = require('./Admin/Edit/EditGroupButton');

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
  StyleSheet
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
  groupActionButtonContainer: {
    alignItems: 'center'
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
      description: React.PropTypes.string.isRequired,
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

        {this._renderGroupActionButton()}
        <GroupStats {...this.props}/>

      </View>
    );
  },

  _renderGroupActionButton: function() {
    if (GroupUtils.isUserAdmin(this.props.group, userLoginMetadataStore.getEmail())) {
      return (
        <View style={styles.groupActionButtonContainer}>
          <EditGroupButton {...this.props}/>
        </View>
      );
    }
    else if (this.props.group.allowsJoinRequests) {
      return (
        <View style={styles.groupActionButtonContainer}>
          <GroupActionButton
            userGroupStatus={this.state.userGroupStatus}
            isLoading={this.state.loadingUserInGroupStatus || this.state.requestToJoinInFlight}
            requestToJoinGroupAction={this.requestToJoin}
            {...this.props}/>
        </View>
      );
    }
  },

  _requestUserGroupStatus: function() {
    if (!this.props.group.allowsJoinRequests) {
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

      }
    );
  }

});

module.exports = GroupInfo;
