'use strict';

var React = require('react');
var ReactNative = require('react-native');

var PrettyTouchable = require('../Common/PrettyTouchable');

var Colors = require('../../Utils/Common/Colors');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

var {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, .5)',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  popup: {
    position: 'relative',
    borderRadius: 12,
    backgroundColor: 'white',
    width: Dimensions.get('window').width * .9,
    paddingTop: 28,
    paddingRight: 12,
    paddingBottom: 10,
    paddingLeft: 12
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 10
  },
  description: {
    fontSize: 18,
    color: Colors.DARK_GRAY,
    textAlign: 'center'
  },
  rulesTitle: {
    fontSize: 20,
    color: Colors.DARK_GRAY,
    fontWeight: '500',
    textAlign: 'center',
    margin: 12
  },
  rule: {
    fontSize: 18,
    color: Colors.DARK_GRAY,
    textAlign: 'left',
    marginBottom: 8
  },
  endDate: {
    fontSize: 18,
    textAlign: 'center'
  },
  learnMoreFooterText: {
    fontSize: 10,
    color: Colors.DARK_GRAY,
    textAlign: 'center'
  }
});

var CompetitionInfoPopup = React.createClass({

  propTypes: {
    onPress: React.PropTypes.func.isRequired
  },

  render: function() {
    return (
      <View style={styles.container}>

        <View style={styles.popup}>
          <Text style={[styles.title, { color: Colors.getPrimaryAppColor() }]}>
            Want to win a $500 party?
          </Text>
          <Text style={styles.description}>
            Get your organization on Youni and start building your org’s reputation on campus!
          </Text>
          <Text style={styles.rulesTitle}>
            Competition Rules
          </Text>
          <Text style={styles.rule}>
            1. Make sure to join your org
          </Text>
          <Text style={styles.rule}>
            2. Post photos and tag your org
          </Text>
          <Text style={styles.rule}>
            3. Find your invite code on your org page to invite members and friends!
          </Text>
          <Text style={styles.rule}>
            4. The more likes, comments, etc. your photos get, the better chance your org has at winning!
          </Text>
          <Text style={[styles.endDate, { color: Colors.getPrimaryAppColor() }]}>
            End: 10/27/16
          </Text>
          <PrettyTouchable
            label="Got it!"
            containerStyle={{
              marginTop: 10,
              height: 44,
              width: Dimensions.get('window').width * .8,
              alignSelf: 'center'
            }}
            onPress={this._onPress}/>

          <Text style={styles.learnMoreFooterText}>
            Still have questions?  Contact us! support@youniapp.com
          </Text>
        </View>

      </View>
    );
  },

  _onPress: function() {
    this.props.onPress();
    AjaxUtils.ajax(
      '/user/disableShowCompetitionPopup',
      {
        userEmail: userLoginMetadataStore.getEmail()
      },
      (res) => {
        
      },
      () => {

      }
    );
  }

});

module.exports = CompetitionInfoPopup;
