'use strict';

var React = require('react');
var ReactNative = require('react-native');

var SubmissionGridThumbnail = require('./SubmissionGridThumbnail');

var {
  View,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  submissionRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

var SubmissionsGrid = React.createClass({

  propTypes: {
    submissions: React.PropTypes.array.isRequired,
    upVoteAction: React.PropTypes.func.isRequired,
    removeUpVoteAction: React.PropTypes.func.isRequired,
    onSubmitCommentAction: React.PropTypes.func.isRequired,
    onDeleteCommentAction: React.PropTypes.func.isRequired,
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

  _renderSubmissionRow: function(leftSubmissionJson, middleSubmissionJson, rightSubmissionJson, index) {
    return (
      <View
        style={styles.submissionRow}
        key={index}>
        {this._renderGridItem(leftSubmissionJson)}
        {this._renderGridItem(middleSubmissionJson)}
        {this._renderGridItem(rightSubmissionJson)}
      </View>
    );
  },
  
  _renderGridItem: function(submission) {
    if (submission) {
      return (
        <SubmissionGridThumbnail
          {...this.props}
          submission={submission}/>
      );
    }
  }

});

module.exports = SubmissionsGrid;
