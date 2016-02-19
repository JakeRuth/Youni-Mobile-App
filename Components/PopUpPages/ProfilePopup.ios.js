'use strict';

var React = require('react-native');
var ProfilePageBody = require('./ProfilePageBody');
var Spinner = require('../Common/Spinner');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var UserUtils = require('../../Utils/User/UserUtils');

var {
  View
} = React;

var ProfilePopup = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired,
    profileUserEmail: React.PropTypes.string.isRequired,
    profileStore: React.PropTypes.any.isRequired
  },

  getInitialState: function() {
    return {
      profileLoading: true,
      userPostsLoading: true,
      isUserFollowingLoading: true,
      user: {},
      loggedInUserIsFollowing: null,
      userPosts: []
    };
  },

  componentDidMount() {
    this._requestProfileInformation();
    this._requestIsUserFollowing();
  },

  render: function() {
    var content, userPosts;

    if (this.state.profileLoading || this.state.isUserFollowingLoading) {
      content = (
        <Spinner/>
      );
    }
    else {
      content = this._renderProfile(this.state.user);

      if (this.state.userPosts.length) {
        userPosts = this._renderProfilePosts();
      }
    }

    return (
      <View>
        {content}
        {userPosts}
      </View>
    );
  },

  _renderProfile: function(user) {
    return (
      <ProfilePageBody
        viewerIsProfileOwner={false}
        user={user}
        navigator={this.props.navigator}/>
    );
  },

  _renderProfilePosts: function() {
    return (
      <UserPosts
        userName={this.props.user.firstName + ' ' + this.props.user.lastName}
        userEmail={this.props.user.email}
        viewerIsProfileOwner={false}
        navigator={this.props.navigator}/>
    );
  },

  _requestProfileInformation: function() {
    var that = this;

    AjaxUtils.ajax(
      '/user/getProfileInformation',
      {
        userEmail: that.props.profileUserEmail
      },
      (res) => {
        that.setState({
          profileLoading: false,
          user: res.body.user
        });
      },
      () => {
        that.setState({
          profileLoading: false
        });
      }
    );
  },

  _requestIsUserFollowing: function() {

  },

  _requestUserPosts: function() {

  }

});

module.exports = ProfilePopup;
