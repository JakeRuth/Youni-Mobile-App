'use strict'

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var Icon = require('react-native-vector-icons/Ionicons');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

var {
  TouchableHighlight,
  AlertIOS,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  deletePostIconContainer: {
    marginRight: 20
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
        underlayColor='transparent'
        style={styles.deletePostIconContainer}
        onPress={this._onDeleteIconPress}>

        <Icon
          name='ios-trash-outline'
          size={45}
          color='#FF7878' />

      </TouchableHighlight>
    );
  },

  _onDeleteIconPress: function() {
    AlertIOS.alert(
      'Delete this post?',
      '',
      [
        {
          text: 'Yes, delete my post forever.',
          onPress: this._onConfirmDeletePress
        },
        {
          text: "No it's actually cute, I want to keep it."
        }
      ]
    );
  },

  _onConfirmDeletePress: function() {
    var userId = userLoginMetadataStore.getUserId();
    Unicycle.exec('deletePost', this.props.id, this.props.postIdString, userId);
  }

});

module.exports = DeletePostIcon;
