'use strict';

var React = require('react-native');

var PrettyTouchable = require('../../Common/PrettyTouchable');
var Spinner = require('../../Common/Spinner');

var Colors = require('../../../Utils/Common/Colors');

var {
  View,
  AlertIOS,
  StyleSheet,
  ActionSheetIOS
} = React;

var styles = StyleSheet.create({
  spinnerContainer: {
    width: 74,
    alignItems: 'center'
  }
});

var AddUserToGroupButton = React.createClass({

  propTypes: {
    isUserInGroup: React.PropTypes.bool.isRequired,
    isRequestInFlight: React.PropTypes.bool.isRequired,
    onPress: React.PropTypes.func.isRequired
  },

  render: function() {
    if (this.props.isRequestInFlight) {
      return (
        <View style={styles.spinnerContainer}>
          <Spinner/>
        </View>
      );
    }
    else {
      return (
        <PrettyTouchable
          label={this._getLabel()}
          containerStyle={{
            width: 74,
            height: 30
          }}
          labelStyle={{
            fontSize: 16
          }}
          invertColors={!this.props.isUserInGroup}
          onPress={this.onPress}/>
      );
    }
  },

  onPress: function(addUserAsAdmin) {
    if (this.props.isUserInGroup) {
      return;
    }
    
    ActionSheetIOS.showActionSheetWithOptions({
      options: [
        'Add user',
        'Add user as admin',
        'Cancel'
      ],
      cancelButtonIndex: 2,
      tintColor: Colors.YOUNI_PRIMARY
    },
    (buttonIndex) => {
      if (buttonIndex === 0) {
        this.props.onPress(false);
      }
      else if (buttonIndex === 1) {
        this._alertAdminWarning();
      }
    });
  },

  _alertAdminWarning: function() {
    AlertIOS.alert(
      'Are you sure?',
      `Admin users are allowed to do the following:\n\n
      Remove users from the group\n
      Remove admins from the group\n
      Make a non admin user an admin\n
      Demote current admins to normal member status`,
      [
        {
          text: 'Yes',
          onPress: () => { this.props.onPress(true); }
        },
        {
          text: 'No'
        }
      ]
    );
  },

  _getLabel: function() {
    if (this.props.isUserInGroup) {
      return 'Added';
    }
    else {
      return 'Add';
    }
  }

});

module.exports = AddUserToGroupButton;
