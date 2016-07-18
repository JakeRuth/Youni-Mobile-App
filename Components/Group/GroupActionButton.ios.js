'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');

var GroupManageUsersPopup = require('../PopupPages/GroupManageUsersPopup');

var Colors = require('../../Utils/Common/Colors');

var {
  View,
  StyleSheet,
  ActionSheetIOS,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingTop: 30,
    paddingRight: 12,
    paddingLeft: 30,
    paddingBottom: 15
  },
  iconContainer: {
    height: 30,
    width: 30,
    backgroundColor: 'rgba(0, 0, 0, .25)',
    paddingTop: 4,
    paddingLeft: 6,
    borderRadius: 15
  }
});

var GroupActionButton = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired,
    group: React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      name: React.PropTypes.string.isRequired,
      description: React.PropTypes.string.isRequired,
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
        style={styles.container}
        underlayColor='transparent'
        onPress={this._onButtonPress}>

        <View style={styles.iconContainer}>
          <Icon
            name='edit'
            size={22}
            color='white'/>
        </View>

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
      tintColor: Colors.YOUNI_PRIMARY_PURPLE
    },
    (buttonIndex) => {
      if (buttonIndex === 0) {
        //TODO
      }
      else if (buttonIndex === 1) {
        this.props.navigator.push({
          component: GroupManageUsersPopup,
          passProps: {...this.props}
        });
      }
      else if (buttonIndex === 2) {
        //TODO
      }
    });
  }

});

module.exports = GroupActionButton;
