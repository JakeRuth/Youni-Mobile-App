'use strict';

var React = require('react');
var ReactNative = require('react-native');
var DismissKeyboard = require('dismissKeyboard');

var SubmitToChallengeForm = require('../CampusChallenge/Submit/SubmitToChallengeForm');
var YouniHeader = require('../Common/YouniHeader');
var BackArrow = require('../Common/BackArrow');

var Colors = require('../../Utils/Common/Colors');

var {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  pageHeader: {
    color: 'white',
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center'
  }
});

var SubmitCampusChallengePopup = React.createClass({

  propTypes: {
    campusChallenge: React.PropTypes.object.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function () {
    return (
      <TouchableWithoutFeedback onPress={() => DismissKeyboard()}>

        <View style={styles.container}>
          <YouniHeader style={{backgroundColor: Colors.getPrimaryAppColor()}}>
            <Text style={styles.pageHeader}>
              Enter {this.props.campusChallenge.name}
            </Text>
            <BackArrow
              color="white"
              onPress={() => this.props.navigator.pop()}/>
          </YouniHeader>

          <SubmitToChallengeForm {...this.props}/>
        </View>

      </TouchableWithoutFeedback>
    );
  }

});

module.exports = SubmitCampusChallengePopup;
