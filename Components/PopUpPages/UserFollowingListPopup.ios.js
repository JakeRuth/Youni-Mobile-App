'use strict';

var React = require('react-native');
var GetAllFollowingPage = require('../Profile/GetAllFollowingPage');
var OverlayPage = require('../Common/OverlayPage');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var UserUtils = require('../../Utils/User/UserUtils');
var userLoginMetaDataStore = require('../../stores/UserLoginMetadataStore');

var UserFollowingListPopup = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      loading: true,
      users: []
    };
  },

  componentDidMount() {
    var that = this,
        userEmail = userLoginMetaDataStore.getEmail();

    AjaxUtils.ajax(
      '/user/getAllFollowing',
      {
        userEmail: userEmail
      },
      (res) => {
        that.setState({
          users: UserUtils.convertResponseUserListToMap(res.body.allFollowerDetails),
          loading: false
        });
      },
      () => {
        that.setState({
          loading: false
        });
      }
    );
  },

  render: function () {
    var pageContent = (
      <GetAllFollowingPage
        loading={this.state.loading}
        users={this.state.users}
        navigator={this.props.navigator}/>
    );

    return (
      <OverlayPage
        content={pageContent}
        onBackArrowPress={() => {this.props.navigator.pop();}}
        bannerTitle='Following'/>
    );
  }

});

module.exports = UserFollowingListPopup;
