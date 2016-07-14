'use strict';

var React = require('react-native');

var GroupUsersList = require('../Group/GroupUsersList');
var YouniHeader = require('../Common/YouniHeader');
var Spinner = require('../Common/Spinner');
var BackArrow = require('../Common/BackArrow');

var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var UserUtils = require('../../Utils/User/UserUtils');

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
  spinnerContainer: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center'
  }
});

var GroupUsersPopup = React.createClass({

  PAGE_SIZE: 40,

  propTypes: {
    groupIdString: React.PropTypes.string.isRequired,
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
    else {
      content = (
        <GroupUsersList
          users={this.state.users}
          isLoading={this.state.isLoading}
          moreToFetch={this.state.moreToFetch}
          onLoadMorePress={this._requestGroupUsers}
          navigator={this.props.navigator}/>
      );
    }
    
    return (
      <View style={styles.container}>
        <YouniHeader>
          <Text style={styles.pageHeader}>
            Members
          </Text>
          <BackArrow onPress={() => { this.props.navigator.pop(); }}/>
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
        groupIdString: that.props.groupIdString,
        fetchOffset: that.state.offset,
        maxToFetch: that.PAGE_SIZE
      },
      (res) => {
        var users = UserUtils.convertResponseUserListToMap(res.body.groupUsers);

        that.setState({
          users: currentUsers.concat(users),
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
