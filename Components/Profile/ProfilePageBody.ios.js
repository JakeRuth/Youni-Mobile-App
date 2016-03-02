'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var FollowButton = require('./FollowButton');
var BlockUserButton = require('./BlockUserButton');
var ProfileImage = require('./ProfileImage');
var TotalProfileCountsContainer = require('./TotalProfileCountsContainer');
var UserFollowingListPopup = require('../PopUpPages/UserFollowingListPopup');
var profileOwnerStore = require('../../stores/profile/ProfileOwnerStore');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');

var {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView
} = React;

var styles = StyleSheet.create({
  profileInformationContainer: {
    backgroundColor: 'white'
  },
  profileHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2
  },
  bio: {
    color: '#525252',
    fontSize: 12,
    margin: 10
  },
  blankLine: {
    borderWidth: 1,
    borderColor: 'lightgray'
  }
});

var ProfilePageBody = React.createClass({

  componentDidMount: function() {
    var userId;
    if (!this.props.viewerIsProfileOwner) {
      this._requestIsUserFollowing();
    }
    else {
      this.setState({
        isFollowRequestInFlight: false
      });
    }
  },

  getInitialState: function() {
    return {
      isFollowRequestInFlight: true,
      isUserFollowing: false
    };
  },

  propTypes: {
    navigator: React.PropTypes.object.isRequired,
    user: React.PropTypes.object.isRequired,
    viewerIsProfileOwner: React.PropTypes.bool.isRequired
  },

  render: function() {
    var blockUserIcon = <View/>;

    if (!this.props.viewerIsProfileOwner) {
      blockUserIcon = <BlockUserButton email={this.props.user.email}/>;
    }

    return (
      <ScrollView
        onScroll={this.onScroll}>

        <View style={styles.profileInformationContainer}>

          <View style={styles.profileHeader}>
            <ProfileImage
              viewerIsProfileOwner={this.props.viewerIsProfileOwner}
              profileImageUrl={this.props.user.profileImageUrl}/>
            <FollowButton
              viewerIsProfileOwner={this.props.viewerIsProfileOwner}
              onButtonPress={this._onFollowButtonPress}
              isRequestInFlight={this.state.isFollowRequestInFlight}
              isUserFollowing={this.state.isUserFollowing}/>
          </View>

          {blockUserIcon}
          <Text style={styles.bio}>
            {this.props.user.bio}
          </Text>

          <TotalProfileCountsContainer
            totalPoints={this.props.user.totalPoints}
            numFollowers={this.props.user.numFollowers}
            numPosts={this.props.user.numPosts}/>

        </View>
      </ScrollView>
    );
  },

  onScroll: function(e) {
    var userId = userLoginMetadataStore.getUserId(),
        userEmail = userLoginMetadataStore.getEmail();

    if (this.props.viewerIsProfileOwner && e.nativeEvent.contentOffset.y < -1) {
      Unicycle.exec('refreshProfileOwnerPosts', userEmail, userId);
    }
  },

  _requestIsUserFollowing: function() {
    var userId = userLoginMetadataStore.getUserId();
    var that = this;

    this.setState({
      isFollowRequestInFlight: true
    });

    AjaxUtils.ajax(
      '/user/isFollowing',
      {
        requestingUserIdString: userId,
        userEmail: that.props.user.email
      },
      (res) => {
        that.setState({
          isFollowRequestInFlight: false,
          isUserFollowing: res.body.following
        });
      },
      () => {
        that.setState({
          isFollowRequestInFlight: false
        });
      }
    );
  },

  _onFollowButtonPress: function() {
    if (this.props.viewerIsProfileOwner) {
      this._getAllUsersTheOwnerIsFollowing();
    }
    else {
      this._followOrUnfollowUser();
    }
  },

  _getAllUsersTheOwnerIsFollowing: function() {
    this.props.navigator.push({
      component: UserFollowingListPopup
    });
  },

  _followOrUnfollowUser: function() {
    var userId = userLoginMetadataStore.getUserId();

    if (this.state.isUserFollowing) {
      this._unfollowUserRequest();
    }
    else {
      this._followUserRequest();
    }
  },

  _followUserRequest: function() {
    var userId = userLoginMetadataStore.getUserId();
    var that = this;

    this.setState({
      isFollowRequestInFlight: true
    });

    AjaxUtils.ajax(
      '/user/follow',
      {
        requestingUserIdString: userId,
        userToFollowEmail: that.props.user.email
      },
      (res) => {
        if (res.body.success) {
          that.props.user.numFollowers++;
        }

        that.setState({
          isFollowRequestInFlight: false,
          isUserFollowing: res.body.success
        });
      },
      () => {
        that.setState({
          isFollowRequestInFlight: false
        });
      }
    );
  },

  _unfollowUserRequest: function() {
    var userId = userLoginMetadataStore.getUserId();
    var that = this;

    this.setState({
      isFollowRequestInFlight: true
    });

    AjaxUtils.ajax(
      '/user/removeFollow',
      {
        requestingUserIdString: userId,
        userToNotFollowEmail: that.props.user.email
      },
      (res) => {
        that.props.user.numFollowers--;
        that.setState({
          isFollowRequestInFlight: false,
          isUserFollowing: false
        });
      },
      () => {
        that.setState({
          isFollowRequestInFlight: false
        });
      }
    );
  }

});

module.exports = ProfilePageBody;
