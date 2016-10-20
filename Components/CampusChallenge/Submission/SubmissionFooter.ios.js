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
    padding: 5
  },
  caption: {
    textAlign: 'center'
  }
});

var SubmissionFooter = React.createClass({

  propTypes: {
    submission: React.PropTypes.object.isRequired
  },

  render: function() {
    var submission = this.props.submission;

    return (
      <View style={styles.container}>
        <Caption
          style={styles.caption}
          text={this.props.submission.caption}/>
      </View>
    );
  }

});

module.exports = SubmissionFooter;
