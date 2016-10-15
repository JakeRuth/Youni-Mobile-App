'use strict';

var React = require('react');
var ReactNative = require('react-native');

var Spinner = require('../../Common/Spinner');

var Colors = require('../../../Utils/Common/Colors');

var {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: Dimensions.get('window').width
  },
  buttonLabel: {
    color: 'white',
    fontSize: 22
  }
});

var SubmitChallengeButton = React.createClass({

  propTypes: {
    campusChallenge: React.PropTypes.object.isRequired,
    isLoading: React.PropTypes.bool,
    onPress: React.PropTypes.func.isRequired
  },

  render: function () {
    return (
      <TouchableHighlight
        style={[styles.container, { backgroundColor: Colors.getPrimaryAppColor()}, this.props.style]}
        underlayColor={Colors.getPrimaryAppColor()}
        onPress={this.props.onPress}>
        {this._renderButtonContent()}
      </TouchableHighlight>
    );
  },

  _renderButtonContent: function() {
    if (this.props.isLoading) {
      return (
        <View>
          <Spinner color="white"/>
        </View>
      );
    }
    else {
      return (
        <Text style={styles.buttonLabel}>
          Post
        </Text>
      );
    }
  }

});

module.exports = SubmitChallengeButton;
