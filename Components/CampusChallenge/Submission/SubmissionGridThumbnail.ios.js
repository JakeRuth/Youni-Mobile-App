'use strict';

var React = require('react');
var ReactNative = require('react-native');

var CampusChallengeSubmissionPopup = require('../../PopupPages/CampusChallengeSubmissionPopup');

var {
  Image,
  StyleSheet,
  Dimensions,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  image: {
    margin: 1,
    height: Dimensions.get('window').width / 3,
    width: Dimensions.get('window').width / 3
  }
});

var SubmissionsGridThumbnail = React.createClass({

  propTypes: {
    submission: React.PropTypes.object.isRequired,
    upVoteAction: React.PropTypes.func.isRequired,
    removeUpVoteAction: React.PropTypes.func.isRequired,
    onSubmitCommentAction: React.PropTypes.func.isRequired,
    onDeleteCommentAction: React.PropTypes.func.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    return (
      <TouchableHighlight
        underlayColor='transparent'
        onPress={this._onGridPress}>
        <Image
          style={styles.image}
          resizeMode="cover"
          source={{uri: this._getSubmissionPhotoUrl(this.props.submission)}}/>
      </TouchableHighlight>
    );
  },

  _onGridPress: function() {
    this.props.navigator.push({
      component: CampusChallengeSubmissionPopup,
      passProps: {...this.props}
    })
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
