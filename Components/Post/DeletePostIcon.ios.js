'use strict'

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var Icon = require('react-native-vector-icons/Ionicons');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

var {
  TouchableHighlight,
  ActionSheetIOS,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  deleteIcon: {
    paddingBottom: 15,
    paddingLeft: 30
  }
});

var DeletePostIcon = React.createClass({

  propTypes: {
    id: React.PropTypes.number.isRequired,
    postIdString: React.PropTypes.string.isRequired
  },

  render: function() {
    return (
      <TouchableHighlight
        style={styles.deleteIcon}
        underlayColor='transparent'
        onPress={this._onDeleteIconPress}>

        <Icon
          name='chevron-down'
          size={15}
          color='#B2B2B2' />

      </TouchableHighlight>
    );
  },

  _onDeleteIconPress: function() {
    ActionSheetIOS.showActionSheetWithOptions({
      options: [
        'Delete Post',
        'Cancel'
      ],
      cancelButtonIndex: 1,
      tintColor: '#1599ED',
    },
    (buttonIndex) => {
      if (buttonIndex === 0) {
        this._onConfirmDeletePress();
      }
    });
  },

  _onConfirmDeletePress: function() {
    var userId = userLoginMetadataStore.getUserId();
    Unicycle.exec('deletePost', this.props.id, this.props.postIdString, userId);
  }

});

module.exports = DeletePostIcon;
