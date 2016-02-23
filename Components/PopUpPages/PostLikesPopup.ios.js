'use strict';

var React = require('react-native');
var PostLikesList = require('../Post/Footer/Like/PostLikesList');
var OverlayPage = require('../Common/OverlayPage');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var UserUtils = require('../../Utils/User/UserUtils');

var PostLikesPopup = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired,
    postId: React.PropTypes.string.isRequired
  },

  getInitialState: function() {
    return {
      loading: true,
      users: []
    };
  },

  componentDidMount() {
    var that = this;

    AjaxUtils.ajax(
      '/post/getLikerDisplayNames',
      {
        postIdString: this.props.postId
      },
      (res) => {
        that.setState({
          users: UserUtils.convertResponseUserListToMap(res.body.userDetails),
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
      <PostLikesList
        loading={this.state.loading}
        users={this.state.users}
        navigator={this.props.navigator}/>
    );
    return (
      <OverlayPage
        content={pageContent}
        onBackArrowPress={() => {this.props.navigator.pop();}}
        bannerTitle='Likes'/>
    );
  }

});

module.exports = PostLikesPopup;
