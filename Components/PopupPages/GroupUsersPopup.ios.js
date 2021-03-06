'use strict';

var React = require('react');
var ReactNative = require('react-native');

var GroupUsersList = require('../Group/GroupUsersList');
var YouniHeader = require('../Common/YouniHeader');
var Spinner = require('../Common/Spinner');
var BackArrow = require('../Common/BackArrow');

var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var Colors = require('../../Utils/Common/Colors');

var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

var {
  View,
  Text,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  pageHeader: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center'
  },
  groupListContainer: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20
  },
  spinnerContainer: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center'
  },
  noUsersMessage: {
    marginTop: 100,
    fontSize: 16,
    color: Colors.DARK_GRAY,
    textAlign: 'center'
  }
});

var GroupUsersPopup = React.createClass({

  PAGE_SIZE: 40,

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
    navigator: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      initialPageLoading: true,
      isLoading: false,
      moreToFetch: false,
      users: [],
      offset: 0
    };
  },

  componentDidMount() {
    this._requestGroupUsers();
  },

  render: function () {
    var content;
    
    if (this.state.initialPageLoading) {
      content = (
        <View style={styles.spinnerContainer}>
          <Spinner/>
        </View>
      );
    }
    else if (this.state.users.length === 0) {
      content = (
        <Text style={styles.noUsersMessage}>
          This group has no users
        </Text>
      );
    }
    else {
      content = (
        <View style={styles.groupListContainer}>
          <GroupUsersList
            users={this.state.users}
            group={this.props.group}
            isLoading={this.state.isLoading}
            moreToFetch={this.state.moreToFetch}
            onLoadMorePress={this._requestGroupUsers}
            navigator={this.props.navigator}/>
        </View>
      );
    }
    
    return (
      <View style={styles.container}>
        <YouniHeader>
          <Text style={[styles.pageHeader, { color: Colors.getPrimaryAppColor() }]}>
            Members
          </Text>
          <BackArrow onPress={() => this.props.navigator.pop()}/>
        </YouniHeader>
        {content}
      </View>
    );
  },

  _requestGroupUsers: function() {
    var that = this,
        currentUsers = this.state.users;

    if (this.state.offset === 0) {
      this.setState({
        initialPageLoading: true
      });
    }
    else {
      this.setState({
        isLoading: true
      });
    }

    AjaxUtils.ajax(
      '/group/fetchUsers',
      {
        groupIdString: this.props.group.id,
        requestingUserEmail: userLoginMetadataStore.getEmail(),
        fetchOffset: this.state.offset,
        maxToFetch: this.PAGE_SIZE
      },
      (res) => {
        that.setState({
          users: currentUsers.concat(res.body.groupUsers),
          moreToFetch: res.body.moreToFetch,
          offset: that.state.offset + that.PAGE_SIZE,
          initialPageLoading: false,
          isLoading: false
        });
      },
      () => {
        that.setState({
          initialPageLoading: false,
          isLoading: false
        });
      }
    );
  }

});

module.exports = GroupUsersPopup;
