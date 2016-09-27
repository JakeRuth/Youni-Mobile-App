'use strict';

var React = require('react');
var ReactNative = require('react-native');

var {
  View,
  Image,
  StyleSheet,
  Dimensions
} = ReactNative;

var styles = StyleSheet.create({
  submissionRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    margin: 1,
    height: Dimensions.get('window').width / 3,
    width: Dimensions.get('window').width / 3
  }
});

var SubmissionsGrid = React.createClass({

  propTypes: {
    submissions: React.PropTypes.array.isRequired,
    upVoteAction: React.PropTypes.func.isRequired,
    removeUpVoteAction: React.PropTypes.func.isRequired,
    onSubmitCommentAction: React.PropTypes.func.isRequired,
    onDeleteCommentAction: React.PropTypes.func.isRequired,
    viewerIsSubmissionOwner: React.PropTypes.bool,
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    var submissionsJson = this.props.submissions,
        submissionRows = [];

    for (var i = 0; i < submissionsJson.length; i+=3) {
      submissionRows.push(
        this._renderSubmissionRow(submissionsJson[i], submissionsJson[i + 1], submissionsJson[i + 2], i)
      );
    }

    return (
      <View>
        {submissionRows}
      </View>
    );
  },

  _renderSubmissionRow: function(leftPostJson, middlePostJson, rightPostJson, index) {
    return (
      <View
        style={styles.submissionRow}
        key={index}>
        {this._renderGridItem(leftPostJson)}
        {this._renderGridItem(middlePostJson)}
        {this._renderGridItem(rightPostJson)}
      </View>
    );
  },
  
  _renderGridItem: function(submission) {
    if (submission) {
      return (
        <Image
          style={styles.image}
          resizeMode="cover"
          source={{uri: this._getSubmissionPhotoUrl(submission)}}/>
      );
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

module.exports = SubmissionsGrid;
