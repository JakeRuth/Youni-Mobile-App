'use strict';

var React = require('react-native');

var ProfileImageThumbnail = require('../../Common/ProfileImageThumbnail');
var Spinner = require('../../Common/Spinner');

var GroupUtils = require('../../../Utils/Group/GroupUtils');
var AjaxUtils = require('../../../Utils/Common/AjaxUtils');
var Colors = require('../../../Utils/Common/Colors');
var userLoginMetadataStore = require('../../../stores/UserLoginMetadataStore');

var {
  View,
  Text,
  StyleSheet,
  ActionSheetIOS,
  AlertIOS,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  container: {
    paddingTop: 11,
    paddingBottom: 11
  },
  userInfoContainer: {
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
  actionFeedbackMessage: {
    color: Colors.MED_GRAY
  },
  spinnerContainer: {
    paddingLeft: 20
  }
});

var ManageGroupUserListItem = React.createClass({

  propTypes: {
    user: React.PropTypes.object.isRequired,
    group: React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      name: React.PropTypes.string.isRequired,
      abbreviatedName: React.PropTypes.string.isRequired,
      description: React.PropTypes.string.isRequired,
      coverImageUrl: React.PropTypes.string.isRequired,
      badgeImageUrl: React.PropTypes.string.isRequired,
      adminEmails: React.PropTypes.array,
      allTimeTrendPoints: React.PropTypes.number.isRequired,
      numPosts: React.PropTypes.number.isRequired,
      numMembers: React.PropTypes.number.isRequired
    }).isRequired,
    displayNameOverride: React.PropTypes.string
  },

  getInitialState: function() {
    return {
      isRequestInFlight: false,
      responseMessageForSuccessfulUserModification: ''
    };
  },

  render: function() {
    return (
      <TouchableHighlight
        style={styles.container}
        underlayColor="transparent"
        onPress={this._onPress}>

        <View style={styles.userInfoContainer}>
          <ProfileImageThumbnail profileImageUrl={this.props.user.profileImageUrl}/>

          <Text style={styles.name}>
            {this._getUserDisplayName()}
            <Text style={styles.actionFeedbackMessage}>
              {`  ${this.state.responseMessageForSuccessfulUserModification}`}
            </Text>
          </Text>
          
          {
            this.state.isRequestInFlight &&
            <View style={styles.spinnerContainer}>
              <Spinner/>
            </View>
          }
        </View>

      </TouchableHighlight>
    );
  },

  _getUserDisplayName: function() {
    if (this.props.displayNameOverride) {
      return this.props.displayNameOverride;
    }
    else if (userLoginMetadataStore.getEmail() === this.props.user.email) {
      return 'Me';
    }
    else {
      return `${this.props.user.firstName} ${this.props.user.lastName}`;
    }
  },

  _onPress: function() {
    // Hopefully we can circle back on this so this isn't needed, but for now you can only take
    // one action on a user per page load.
    if (this.state.responseMessageForSuccessfulUserModification.length > 0) {
      return;
    }

    if (userLoginMetadataStore.getEmail() === this.props.user.email) {
      this._showSelfOptions();
    }
    else if (GroupUtils.isUserAdmin(this.props.group, this.props.user.email)) {
      this._showAdminOptions();
    }
    else {
      this._showNonAdminOptions();
    }
  },

  _showSelfOptions: function() {
    ActionSheetIOS.showActionSheetWithOptions({
      options: [
        'Revoke admin permission',
        'Remove self from group',
        'Cancel'
      ],
      cancelButtonIndex: 2,
      tintColor: Colors.YOUNI_PRIMARY
    },
    (buttonIndex) => {
      if (buttonIndex === 0) {
        this._removeAdminPermissionPrompt();
      }
      else if (buttonIndex === 1) {
        this._removeSelfFromGroupPrompt();
      }
    });
  },

  _showAdminOptions: function() {
    ActionSheetIOS.showActionSheetWithOptions({
      options: [
        'Revoke admin permission',
        'Remove admin from group',
        'Cancel'
      ],
      cancelButtonIndex: 2,
      tintColor: Colors.YOUNI_PRIMARY
    },
    (buttonIndex) => {
      if (buttonIndex === 0) {
        this._removeAdminPermissionPrompt();
      }
      else if (buttonIndex === 1) {
        this._removeAdminFromGroupPrompt();
      }
    });
  },

  _showNonAdminOptions: function() {
    ActionSheetIOS.showActionSheetWithOptions({
      options: [
        'Make admin',
        'Remove from group',
        'Cancel'
      ],
      cancelButtonIndex: 2,
      tintColor: Colors.YOUNI_PRIMARY
    },
    (buttonIndex) => {
      if (buttonIndex === 0) {
        this._makeUserAdminPrompt();
      }
      else if (buttonIndex === 1) {
        this._removeUserFromGroupPrompt();
      }
    });
  },

  _removeAdminPermissionPrompt: function() {
    if (this.props.group.adminEmails.length <= 1) {
      this._alertCannotRemoveAdmin();
    }
    else {
      AlertIOS.alert(
        'Are you sure?',
        `You are about to remove ${this.props.user.firstName}'s admin status.`,
        [
          {
            text: 'Yes',
            onPress: () => {
              this._removeAdminPermission();
            }
          },
          {
            text: 'No'
          }
        ]
      );
    }
  },

  _alertCannotRemoveAdmin: function() {
    AlertIOS.alert(
      'Hold up hold up...',
      'You cannot remove this admin because there is only one admin in the group. A group must always have at least one admin.',
      [
        {
          text: 'Okay'
        }
      ]
    );
  },

  _makeUserAdminPrompt: function() {
    AlertIOS.alert(
      'Are you sure?',
      `You are about to make ${this.props.user.firstName} an admin from this group.  As an admin ${this.props.user.firstName} will be able to:\n\n
      Remove users from the group\n
      Remove admins from the group\n
      Make a non admin user an admin\n
      Demote current admins to normal member status`,
      [
        {
          text: 'Yes',
          onPress: () => { this._makeUserAdmin(); }
        },
        {
          text: 'No'
        }
      ]
    );
  },

  _removeUserFromGroupPrompt: function() {
    AlertIOS.alert(
      'Are you sure?',
      `You are about to remove ${this.props.user.firstName} from this group.`,
      [
        {
          text: 'Yes',
          onPress: () => { this._removeUserFromGroup(); }
        },
        {
          text: 'No'
        }
      ]
    );
  },

  _removeAdminFromGroupPrompt: function() {
    if (this.props.group.adminEmails.length <= 1) {
      this._alertCannotRemoveAdmin();
    }
    else {
      AlertIOS.alert(
        'Are you sure?',
        `You are about to remove the fellow admin ${this.props.user.firstName} from this group.`,
        [
          {
            text: 'Yes',
            onPress: () => {
              this._removeAdminUserFromGroup();
            }
          },
          {
            text: 'No'
          }
        ]
      );
    }
  },

  _removeSelfFromGroupPrompt: function() {
    if (this.props.group.adminEmails.length <= 1) {
      this._alertCannotRemoveAdmin();
    }
    else {
      AlertIOS.alert(
        'Are you sure?',
        `You are about to remove yourself from the group, as well your status as admin.
        In order to get back into this group, an existing member will need to re-add you back to this group.`,
        [
          {
            text: 'Yes',
            onPress: () => {
              this._removeAdminUserFromGroup();
            }
          },
          {
            text: 'No'
          }
        ]
      );
    }
  },

  _removeAdminPermission: function() {
    var that = this;

    this.setState({
      isRequestInFlight: true
    });

    AjaxUtils.ajax(
      '/group/demoteUserFromAdmin',
      {
        requestingUserIdString: userLoginMetadataStore.getUserId(),
        groupIdString: this.props.group.id,
        userToDemoteEmail: this.props.user.email
      },
      (res) => {
        that.setState({
          responseMessageForSuccessfulUserModification: 'is no longer an admin',
          isRequestInFlight: false
        });
      },
      () => {
        that.setState({
          responseMessageForSuccessfulUserModification: 'Action Failed.',
          isRequestInFlight: false
        });
      }
    );
  },

  _makeUserAdmin: function() {
    var that = this;

    this.setState({
      isRequestInFlight: true
    });

    AjaxUtils.ajax(
      '/group/promoteUserToAdmin',
      {
        requestingUserIdString: userLoginMetadataStore.getUserId(),
        groupIdString: this.props.group.id,
        userToPromoteEmail: this.props.user.email
      },
      (res) => {
        that.setState({
          responseMessageForSuccessfulUserModification: 'is now an admin',
          isRequestInFlight: false
        });
      },
      () => {
        that.setState({
          responseMessageForSuccessfulUserModification: 'Action Failed.',
          isRequestInFlight: false
        });
      }
    );
  },

  _removeUserFromGroup: function() {
    var that = this;

    this.setState({
      isRequestInFlight: true
    });

    AjaxUtils.ajax(
      '/group/removeUser',
      {
        requestingUserIdString: userLoginMetadataStore.getUserId(),
        groupIdString: this.props.group.id,
        userToRemoveEmail: this.props.user.email
      },
      (res) => {
        that.setState({
          responseMessageForSuccessfulUserModification: 'has been removed',
          isRequestInFlight: false
        });
      },
      () => {
        that.setState({
          responseMessageForSuccessfulUserModification: 'Action Failed.',
          isRequestInFlight: false
        });
      }
    );
  },

  _removeAdminUserFromGroup: function() {
    var that = this;

    this.setState({
      isRequestInFlight: true
    });

    AjaxUtils.ajax(
      '/group/removeAdminUser',
      {
        requestingUserIdString: userLoginMetadataStore.getUserId(),
        groupIdString: this.props.group.id,
        userToRemoveEmail: this.props.user.email
      },
      (res) => {
        that.setState({
          responseMessageForSuccessfulUserModification: 'has been removed',
          isRequestInFlight: false
        });
      },
      () => {
        that.setState({
          responseMessageForSuccessfulUserModification: 'Action Failed.',
          isRequestInFlight: false
        });
      }
    );
  }

});

module.exports = ManageGroupUserListItem;
