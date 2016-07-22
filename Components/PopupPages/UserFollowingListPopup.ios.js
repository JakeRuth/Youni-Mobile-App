'use strict';

var React = require('react-native');
var GetAllFollowingPage = require('../Profile/Following/GetAllFollowingPage');
var OverlayPage = require('../Common/OverlayPage');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var UserUtils = require('../../Utils/User/UserUtils');
var userLoginMetaDataStore = require('../../stores/UserLoginMetadataStore');

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
    var pageContent = (
      <GetAllFollowingPage
        initialPageLoading={this.state.initialPageLoading}
        isLoading={this.state.isLoading}
        moreToFetch={this.state.moreToFetch}
        onLoadMorePress={this._requestFollowingUsers}
        users={this.state.users}
        navigator={this.props.navigator}/>
    );

    return (
      <OverlayPage
        content={pageContent}
        onBackArrowPress={() => {this.props.navigator.pop();}}
        bannerTitle='Following'/>
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
