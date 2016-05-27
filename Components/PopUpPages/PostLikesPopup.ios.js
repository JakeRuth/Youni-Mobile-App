'use strict';

var React = require('react-native');
var PostLikesList = require('../Post/Footer/Like/PostLikesList');
var OverlayPage = require('../Common/OverlayPage');
var Spinner = require('../Common/Spinner');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var UserUtils = require('../../Utils/User/UserUtils');

var PostLikesPopup = React.createClass({

  PAGE_SIZE: 50,

  propTypes: {
    navigator: React.PropTypes.object.isRequired,
    postId: React.PropTypes.string.isRequired
  },

  getInitialState: function() {
    return {
      likerUsers: [],
      isInitialPageLoading: true,
      isLoadingMore: false,
      moreToFetch: false,
      offset: 0
    };
  },

  componentDidMount() {
    this._fetchLikerUsers();
  },

  render: function () {
    var pageContent;

    if (this.state.isInitialPageLoading) {
      pageContent = <Spinner/>;
    }
    else {
      pageContent = (
        <PostLikesList
          isLoadingMoreUsers={this.state.isLoadingMore}
          moreToFetch={this.state.moreToFetch}
          onLoadMorePress={this._fetchLikerUsers}
          users={this.state.likerUsers}
          navigator={this.props.navigator}/>
      );
    }

    return (
      <OverlayPage
        content={pageContent}
        onBackArrowPress={() => {this.props.navigator.pop();}}
        bannerTitle='Likes'/>
    );
  },

  _fetchLikerUsers: function() {
    var that = this,
        currentLikerUsers = this.state.likerUsers;

    if (this.state.offset === 0) {
      this.setState({
        isInitialPageLoading: true
      });
    }
    else {
      this.setState({
        isLoadingMore: true
      });
    }

    AjaxUtils.ajax(
      '/post/fetchLikerUsers',
      {
        postIdString: this.props.postId,
        fetchOffsetAmount: that.state.offset,
        maxToFetch: that.PAGE_SIZE
      },
      (res) => {
        var likerUsers = UserUtils.convertResponseUserListToMap(res.body.users);

        that.setState({
          likerUsers: currentLikerUsers.concat(likerUsers),
          moreToFetch: res.body.moreToFetch,
          offset: that.state.offset + that.PAGE_SIZE,
          isInitialPageLoading: false,
          isLoadingMore: false
        });
      },
      () => {
        that.setState({
          isInitialPageLoading: false,
          isLoadingMore: false
        });
      }
    );
  }

});

module.exports = PostLikesPopup;
