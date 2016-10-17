'use strict';

var React = require('react');
var ReactNative = require('react-native');

var CampusChallengeSubmissionPopup = require('../../PopupPages/CampusChallengeSubmissionPopup');

var {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 1,
    // subtract two to take into account margin so three can display in a row within any screen width
    height: (Dimensions.get('window').width / 3) - 2,
    width: (Dimensions.get('window').width / 3) - 2
  },
  image: {
    height: (Dimensions.get('window').width / 3) - 2,
    width: (Dimensions.get('window').width / 3) - 2
  }
});

var SubmissionsGridThumbnail = React.createClass({

  propTypes: {
    submission: React.PropTypes.object.isRequired,
    upVoteAction: React.PropTypes.func.isRequired,
    index: React.PropTypes.number.isRequired,
    navigator: React.PropTypes.object
  },

  render: function() {
    return (
      <TouchableHighlight
        style={styles.container}
        underlayColor='transparent'
        onPress={this._onGridPress}>
        <View>
          <Image
            style={styles.image}
            resizeMode="cover"
            source={{uri: this._getSubmissionPhotoUrl(this.props.submission)}}/>
          {this.props.children}
        </View>
      </TouchableHighlight>
    );
  },

  _onGridPress: function() {
    if (this.props.navigator) {
      this.props.navigator.push({
        component: CampusChallengeSubmissionPopup,
        passProps: {...this.props}
      });
    }
  },

  _getSubmissionPhotoUrl: function(submission) {
    if (submission.postId && !submission.isAnonymous) {
      return submission.postJson.photoUrl;
    }
    else {
      return submission.photoUrl;
    }
  }

});

module.exports = SubmissionsGridThumbnail;
