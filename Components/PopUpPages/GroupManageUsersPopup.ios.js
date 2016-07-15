'use strict';

var React = require('react-native');

var GroupUsersList = require('../Group/GroupUsersList');
var AddNewGroupUserTrigger = require('../Group/Admin/AddNewGroupUserTrigger');
var ManageGroupUsersSection = require('../Group/Admin/ManageGroupUsersSection');
var ManageGroupUserListItem = require('../Group/Admin/ManageGroupUserListItem');
var YouniHeader = require('../Common/YouniHeader');
var Spinner = require('../Common/Spinner');
var BackArrow = require('../Common/BackArrow');
var GroupAddNewUserPopup = require('./GroupAddNewUserPopup');

var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var Colors = require('../../Utils/Common/Colors');

var {
  View,
  Text,
  ScrollView,
  StyleSheet
} = React;


var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  pageHeader: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    color: 'white'
  },
  contentContainer: {
    flex: 1
  },
  loadingSectionMessage: {
    color: Colors.DARK_GRAY,
    fontSize: 16,
    fontWeight: '100',
    padding: 24,
    paddingLeft: 0
  }
});

var GroupManageUsersPopup = React.createClass({

  PAGE_SIZE: 40,

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

  getInitialState: function() {
    return {
      isAdminUsersRequestInFlight: true,
      isInitialUsersRequestInFlight: true,
      isMoreUsersRequestInFlight: false,
      adminUsers: [],
      users: [],
      moreToFetch: false,
      offset: 0
    };
  },

  componentDidMount() {
    this._requestAllGroupAdmins();
    this._fetchGroupUsers();
  },

  render: function () {
    return (
      <View style={styles.container}>

        <YouniHeader>
          <Text style={styles.pageHeader}>
            Manage Members
          </Text>
          <BackArrow onPress={() => { this.props.navigator.pop(); }}/>
        </YouniHeader>

        <ScrollView
          style={styles.contentContainer}
          automaticallyAdjustContentInsets={false}>
          <AddNewGroupUserTrigger onPress={this.onAddNewUserPress}/>

          <ManageGroupUsersSection heading="Admin">
            {this._renderAdminGroupUsers()}
          </ManageGroupUsersSection>

          <ManageGroupUsersSection heading="Members">
            {this._renderGroupUsers()}
          </ManageGroupUsersSection>
        </ScrollView>

      </View>
    );
  },
  
  _renderAdminGroupUsers: function() {
    var content;
    
    if (this.state.isAdminUsersRequestInFlight) {
      content = (
        <Text style={styles.loadingSectionMessage}>
          Loading admin members...
        </Text>
      );
    }
    else {
      content = [];
      for (var i = 0; i < this.state.adminUsers.length; i++) {
        let user = this.state.adminUsers[i];
        content.push(
          <ManageGroupUserListItem
            user={user}
            key={i}/>
        );
      }
    }
    
    return (
      <View>
        {content}
      </View>
    )
  },

  _renderGroupUsers: function() {
    var content;

    if (this.state.isInitialUsersRequestInFlight) {
      content = (
        <Text style={styles.loadingSectionMessage}>
          Loading members...
        </Text>
      );
    }
    else {
      content = (
        <GroupUsersList
          users={this.state.users}
          isLoading={this.state.isMoreUsersRequestInFlight}
          moreToFetch={this.state.moreToFetch}
          onLoadMorePress={this._fetchGroupUsers}
          manageUsers={true}
          navigator={this.props.navigator}/>
      );
    }

    return (
      <View>
        {content}
      </View>
    )
  },

  onAddNewUserPress: function() {
    this.props.navigator.push({
      component: GroupAddNewUserPopup,
      passProps: {...this.props}
    });
  },
  
  _requestAllGroupAdmins: function() {
    var that = this;
    
    AjaxUtils.ajax(
      '/group/getAllAdminUsers',
      {
        requestingUserIdString: userLoginMetadataStore.getUserId(),
        groupIdString: that.props.group.id
      },
      (res) => {
        that.setState({
          adminUsers: res.body.users,
          isAdminUsersRequestInFlight: false
        });
      },
      () => {
        that.setState({
          isAdminUsersRequestInFlight: false
        });
      }
    );
  },

  _fetchGroupUsers: function() {
    var that = this,
        currentUsers = this.state.users;

    if (this.state.offset === 0) {
      this.setState({
        isInitialUsersRequestInFlight: true
      });
    }
    else {
      this.setState({
        isMoreUsersRequestInFlight: true
      });
    }

    AjaxUtils.ajax(
      '/group/fetchUsers',
      {
        groupIdString: that.props.group.id,
        fetchOffset: that.state.offset,
        maxToFetch: that.PAGE_SIZE
      },
      (res) => {
        that.setState({
          users: currentUsers.concat(res.body.groupUsers),
          moreToFetch: res.body.moreToFetch,
          offset: that.state.offset + that.PAGE_SIZE,
          isInitialUsersRequestInFlight: false,
          isMoreUsersRequestInFlight: false
        });
      },
      () => {
        that.setState({
          isInitialUsersRequestInFlight: false,
          isMoreUsersRequestInFlight: false
        });
      }
    );
  }

});

module.exports = GroupManageUsersPopup;
