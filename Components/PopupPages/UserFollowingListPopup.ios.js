'use strict';

var React = require('react-native');

var GetAllFollowingPage = require('../Profile/Following/GetAllFollowingPage');
var YouniHeader = require('../Common/YouniHeader');
var BackArrow = require('../Common/BackArrow');

var userLoginMetaDataStore = require('../../stores/UserLoginMetadataStore');
var Colors = require('../../Utils/Common/Colors');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var UserUtils = require('../../Utils/User/UserUtils');

var {
  View,
  Text,
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
    color: Colors.YOUNI_PRIMARY
  }
});

var UserFollowingListPopup = React.createClass({

  PAGE_SIZE: 40,

  propTypes: {
    navigator: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      initialPageLoading: false,
      isLoading: false,
      moreToFetch: false,
      users: [],
      offset: 0
    };
  },

  componentDidMount() {
    this._requestFollowingUsers();
  },

  render: function () {
    return (
      <View style={styles.container}>
        <YouniHeader>
          <Text style={styles.pageHeader}>
            Following
          </Text>
          <BackArrow onPress={() => this.props.navigator.pop()}/>
        </YouniHeader>

        <GetAllFollowingPage
          initialPageLoading={this.state.initialPageLoading}
          isLoading={this.state.isLoading}
          moreToFetch={this.state.moreToFetch}
          onLoadMorePress={this._requestFollowingUsers}
          users={this.state.users}
          navigator={this.props.navigator}/>
      </View>
    );
  },

  _requestFollowingUsers: function() {
    var that = this,
        currentUsers = this.state.users,
        userEmail = userLoginMetaDataStore.getEmail();

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
      '/user/fetchFollowing',
      {
        userEmail: userEmail,
        fetchOffsetAmount: that.state.offset,
        maxToFetch: that.PAGE_SIZE
      },
      (res) => {
        var users = UserUtils.convertResponseUserListToMap(res.body.followingUsers);

        that.setState({
          users: currentUsers.concat(users),
          moreToFetch: res.body.moreResults,
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

module.exports = UserFollowingListPopup;
