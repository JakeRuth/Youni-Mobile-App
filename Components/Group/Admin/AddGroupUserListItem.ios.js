'use strict';

var React = require('react');
var ReactNative = require('react-native');

var AddUserToGroupButton = require('./AddUserToGroupButton');
var ProfileImageThumbnail = require('../../Common/ProfileImageThumbnail');

var AjaxUtils = require('../../../Utils/Common/AjaxUtils');
var Colors = require('../../../Utils/Common/Colors');
var userLoginMetadataStore = require('../../../stores/UserLoginMetadataStore');

var {
  View,
  Text,
  StyleSheet,
  AlertIOS,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 10
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  name: {
    flex: 1,
    color: Colors.DARK_GRAY,
    fontSize: 16,
    fontWeight: '300',
    marginLeft: 20
  }
});

var AddGroupUserListItem = React.createClass({

  propTypes: {
    user: React.PropTypes.object.isRequired,
    groupIdString: React.PropTypes.string.isRequired,
    key: React.PropTypes.any.isRequired
  },

  getInitialState: function() {
    return {
      isAddUserRequestInFlight: false,
      userAddedSuccessfully: false
    };
  },

  render: function() {
    var user = this.props.user;
    
    return (
      <TouchableHighlight
        style={styles.container}
        underlayColor="transparent"
        key={this.props.key}>

        <View style={styles.userInfo}>
          <ProfileImageThumbnail profileImageUrl={user.profileImageUrl}/>
          <Text style={styles.name}>
            {`${user.firstName} ${user.lastName}`}
          </Text>
          <AddUserToGroupButton
            isUserInGroup={this.props.user.isInGroup || this.state.userAddedSuccessfully}
            isRequestInFlight={this.state.isAddUserRequestInFlight}
            onPress={(isUserToAddAdmin) => { this.onAddUserPress(user, isUserToAddAdmin); }}/>
        </View>

      </TouchableHighlight>
    );
  },

  onAddUserPress: function(user, isUserToAddAdmin) {
    var that = this,
        endpoint;

    if (user.isInGroup) {
      return;
    }

    if (isUserToAddAdmin) {
      endpoint = '/group/addAdminUser';
    }
    else {
      endpoint = '/group/addUser';
    }

    this.setState({
      isAddUserRequestInFlight: true
    });

    AjaxUtils.ajax(
      endpoint,
      {
        requestingUserIdString: userLoginMetadataStore.getUserId(),
        groupIdString: this.props.groupIdString,
        userToAddEmail: user.email
      },
      (res) => {
        that.setState({
          isAddUserRequestInFlight: false,
          userAddedSuccessfully: true
        });
      },
      () => {
        that.setState({
          isAddUserRequestInFlight: false
        });
        that._alertErrorAddingUser();
      }
    );
  },

  _alertErrorAddingUser: function() {
    AlertIOS.alert(
      'Error adding user',
      'If this problem persists please contact youni support: support@youniapp.com',
      [
        {
          text: 'Okay'
        }
      ]
    );
  }

});

module.exports = AddGroupUserListItem;
