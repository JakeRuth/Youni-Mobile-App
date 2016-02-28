'use strict';

var React = require('react-native');
var Unicycle = require('../../../Unicycle');
var ProfilePopup = require('../../PopupPages/ProfilePopup');
var userLoginMetadataStore = require('../../../stores/UserLoginMetadataStore');

var {
  View,
  Text,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  commenterName: {
    color: '#0083D4'
  },
  commentText: {
    flex: 1,
    fontSize: 13,
    color: '#525252',
    paddingTop: 4,
    paddingBottom: 4
  }
});

var Comment = React.createClass({

  propTypes: {
    commenterName: React.PropTypes.string.isRequired,
    commentText: React.PropTypes.string.isRequired,
    commenterEmail: React.PropTypes.string.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    return (
      <View style={styles.container}>

        <Text style={styles.commentText}>

          <Text
            style={styles.commenterName}
            numberOfLines={1}
            onPress={this._onCommenterNamePress}>
            {this.props.commenterName + '  '}
          </Text>
          {this.props.commentText}

        </Text>

      </View>
    );
  },

  _onCommenterNamePress: function() {
    var userEmail = userLoginMetadataStore.getEmail();

    if (userEmail !== this.props.commenterEmail) {
      this.props.navigator.push({
        component: ProfilePopup,
        passProps: {profileUserEmail: this.props.commenterEmail}
      })
    }
  }

});

module.exports = Comment;
