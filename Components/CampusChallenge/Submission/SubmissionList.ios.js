'use strict';

var React = require('react');
var ReactNative = require('react-native');

var Submission = require('./Submission');
var SubmissionsGrid = require('./SubmissionsGrid');
var LoadMoreButton = require('../../Common/LoadMoreButton');

var {
  View,
  Text,
  StyleSheet,
  ScrollView
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    backgroundColor: 'white'
  }
});

var SubmissionList = React.createClass({

  propTypes: {
    submissions: React.PropTypes.array.isRequired,
    winningSubmissions: React.PropTypes.array,
    onLoadMoreSubmissionsPress: React.PropTypes.func.isRequired,
    isNextPageLoading: React.PropTypes.bool.isRequired,
    noMoreSubmissionsToFetch: React.PropTypes.bool.isRequired,
    gridViewEnabled: React.PropTypes.bool,
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    return (
      <ScrollView
        style={[styles.container, this.props.style]}
        automaticallyAdjustContentInsets={false}>

        {this._renderSubmissions()}
        {this._renderLoadMorePostsButton()}

      </ScrollView>
    );
  },

  _renderSubmissions: function() {
    if (this.props.gridViewEnabled) {
      return (
        <SubmissionsGrid {...this.props}/>
      );
    }
    else {
      return this._renderSubmissionsSequentially(this.props.submissions);
    }
  },

  _renderSubmissionsSequentially: function(submissionsJson) {
    var submissions = [];

    for (var i = 0; i < submissionsJson.length; i++) {
      submissions.push(
        <Submission
          {...this.props}
          key={i}
          submission={submissionsJson[i]}/>
      );
    }

    return submissions;
  },

  _renderLoadMorePostsButton: function() {
    return (
      <LoadMoreButton
        style={this.props.loadMoreButtonStyle}
        onPress={this.props.onLoadMoreSubmissionsPress}
        isLoading={this.props.isNextPageLoading}
        isVisible={!this.props.noMoreSubmissionsToFetch}/>
    );
  }

});

module.exports = SubmissionList;