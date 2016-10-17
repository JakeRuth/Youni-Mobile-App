'use strict';

var React = require('react');
var ReactNative = require('react-native');

var Caption = require('../../Post/Footer/Caption');

var {
  View,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingTop: 5
  }
});

var SubmissionFooter = React.createClass({

  propTypes: {
    submission: React.PropTypes.object.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    var submission = this.props.submission;

    return (
      <View style={styles.container}>
        <Caption text={this.props.submission.caption}/>
      </View>
    );
  }

});

module.exports = SubmissionFooter;
