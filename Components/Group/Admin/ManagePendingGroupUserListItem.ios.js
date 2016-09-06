'use strict';

var React = require('react');
var ReactNative = require('react-native');

var AcceptOrRejectJoinRequest = require('./AcceptOrRejectJoinRequest');
var ProfileImageThumbnail = require('../../Common/ProfileImageThumbnail');
var Spinner = require('../../Common/Spinner');
var ProfilePopup = require('../../PopupPages/ProfilePopup');

var AjaxUtils = require('../../../Utils/Common/AjaxUtils');
var Colors = require('../../../Utils/Common/Colors');
var userLoginMetadataStore = require('../../../stores/UserLoginMetadataStore');

var {
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    paddingTop: 11,
    paddingBottom: 11
  },
  userInfoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  name: {
    flex: 1,
    color: Colors.DARK_GRAY,
    fontSize: 16,
    fontWeight: '300',
    marginLeft: 20
  },
  respondToRequestControlsContainer: {
    width: 54
  },
  responseMessage: {
    fontSize: 14,
    color: Colors.MED_GRAY
  }
});

var ManagePendingGroupUserListItem = React.createClass({

  propTypes: {
    user: React.PropTypes.object.isRequired,
    groupId: React.PropTypes.string.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      isRequestInFlight: false,
      requestWasAccepted: false,
      requestWasDenied: false
    };
  },

  render: function() {
    return (
      <TouchableHighlight
        style={styles.container}
        underlayColor="transparent"
        onPress={this._onPress}>

        <View style={styles.userInfoContainer}>
          <View style={styles.userInfoContainer}>
            <ProfileImageThumbnail profileImageUrl={this.props.user.profileImageUrl}/>

            <Text style={styles.name}>
              {`${this.props.user.firstName} ${this.props.user.lastName}`}
            </Text>
          </View>

          {this._renderRespondToRequestControls()}
        </View>

      </TouchableHighlight>
    );
  },

  _renderRespondToRequestControls: function() {
    if (this.state.isRequestInFlight) {
      return (
        <View style={styles.respondToRequestControlsContainer}>
          <Spinner/>
        </View>
      );
    }
    else if (this.state.requestWasAccepted) {
      return (
        <Text style={styles.responseMessage}>
          Accepted
        </Text>
      );
    }
    else if (this.state.requestWasDenied) {
      return (
        <Text style={styles.responseMessage}>
          Denied
        </Text>
      );
    }
    else {
      return (
        <View style={styles.respondToRequestControlsContainer}>
          <AcceptOrRejectJoinRequest
            onAcceptAction={() => this.respondToJoinRequest(true)}
            onRejectAction={() => this.respondToJoinRequest(false)}/>
        </View>
      );
    }
  },

  _onPress: function() {
    this.props.navigator.push({
      component: ProfilePopup,
      passProps: {
        profileUserEmail: this.props.user.email
      }
    });
  },

  respondToJoinRequest: function(acceptJoinRequest) {
    var that = this;

    this.setState({
      isRequestInFlight: true,
      requestWasAccepted: acceptJoinRequest,
      requestWasDenied: !acceptJoinRequest
    });

    AjaxUtils.ajax(
      '/group/respondToJoinRequest',
      {
        groupIdString: this.props.groupId,
        pendingUserEmail: this.props.user.email,
        requestingUserEmail: userLoginMetadataStore.getEmail(),
        acceptRequest: acceptJoinRequest
      },
      (res) => {
        that.setState({
          isRequestInFlight: false
        });
      },
      () => {
        that.setState({
          isRequestInFlight: false
        });
      }
    );
  }

});

module.exports = ManagePendingGroupUserListItem;
