'use strict';

var React = require('react');
var ReactNative = require('react-native');

var GroupManagePhotosPopup = require('../../../PopupPages/GroupManagePhotosPopup');
var GroupManageUsersPopup = require('../../../PopupPages/GroupManageUsersPopup');
var GroupEditInfoPopup = require('../../../PopupPages/GroupEditInfoPopup');

var Colors = require('../../../../Utils/Common/Colors');
var UserGroupStatus = require('../../../../Utils/Enums/UserGroupStatus');

var {
  Text,
  View,
  StyleSheet,
  ActionSheetIOS,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: 146,
    height: 34,
    borderWidth: 1,
    borderRadius: 6
  },
  buttonLabel: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center'
  }
});

var EditGroupButton = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired,
    group: React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      name: React.PropTypes.string.isRequired,
      abbreviatedName: React.PropTypes.string.isRequired,
      description: React.PropTypes.string,
      coverImageUrl: React.PropTypes.string.isRequired,
      badgeImageUrl: React.PropTypes.string.isRequired,
      adminEmails: React.PropTypes.array,
      allTimeTrendPoints: React.PropTypes.number.isRequired,
      numPosts: React.PropTypes.number.isRequired,
      numMembers: React.PropTypes.number.isRequired
    }).isRequired,
    onPageReturnCallback: React.PropTypes.func.isRequired
  },

  render: function () {
    return (
      <TouchableHighlight
        style={[styles.container, { borderColor: Colors.getPrimaryAppColor() }]}
        underlayColor="transparent"
        onPress={this._onButtonPress}>
        <Text style={[styles.buttonLabel, {color: Colors.getPrimaryAppColor()}]}>
          {UserGroupStatus.IS_ADMIN.label}
        </Text>
      </TouchableHighlight>
    );
  },
  
  _onButtonPress: function() {
    ActionSheetIOS.showActionSheetWithOptions({
      options: [
        'Manage Photos',
        'Manage Members',
        'Edit Organization Profile',
        'Cancel'
      ],
      cancelButtonIndex: 3,
      tintColor: Colors.getPrimaryAppColor()
    },
    (buttonIndex) => {
      if (buttonIndex === 0) {
        this._pushPopup(GroupManagePhotosPopup);
      }
      else if (buttonIndex === 1) {
        this._pushPopup(GroupManageUsersPopup);
      }
      else if (buttonIndex === 2) {
        this._pushPopup(GroupEditInfoPopup);
      }
    });
  },
  
  _pushPopup(popup) {
    this.props.navigator.push({
      component: popup,
      passProps: {...this.props}
    });
  }

});

module.exports = EditGroupButton;
