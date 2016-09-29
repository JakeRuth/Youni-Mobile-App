'use strict';

var React = require('react');
var ReactNative = require('react-native');

var YouniHeader = require('../Common/YouniHeader');
var BackArrow = require('../Common/BackArrow');

var Colors = require('../../Utils/Common/Colors');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var CampusChallengeUtils = require('../../Utils/CampusChallenge/CampusChallengeUtils');

var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

var {
  View,
  Text,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  pageHeaderLabel: {
    fontSize: 20,
    fontWeight: '500',
    color: 'white',
    textAlign: 'center'
  }
});

var CampusChallengePopup = React.createClass({

  propTypes: {
    challenge: React.PropTypes.object.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function () {
    return (
      <View style={styles.container}>

        <YouniHeader style={{backgroundColor: Colors.getPrimaryAppColor()}}>
          <Text style={styles.pageHeaderLabel}>
            Campus Challenge
          </Text>
          <BackArrow
            color="white"
            onPress={() => this.props.navigator.pop()}/>
        </YouniHeader>

      </View>
    );
  },

  someFunc: function(comment, post, callback) {
    AjaxUtils.ajax(
      '/post/deleteComment',
      {

      },
      (res) => {

      },
      () => {

      }
    );
  }

});

module.exports = CampusChallengePopup;
