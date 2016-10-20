'use strict';

var React = require('react');
var ReactNative = require('react-native');

var Submission = require('../CampusChallenge/Submission/Submission');
var YouniHeader = require('../Common/YouniHeader');
var BackArrow = require('../Common/BackArrow');

var Colors = require('../../Utils/Common/Colors');
var LogoImageSize = require('../../Utils/Enums/LogoImageSize');

var {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE_SMOKE
  },
  pageHeader: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    marginTop: -12,
    width: LogoImageSize.WIDTH * .1,
    height: LogoImageSize.HEIGHT * .1
  },
  statsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  rankingText: {
    fontSize: 30
  }
});

var CampusChallengeSubmissionPopup = React.createClass({

  propTypes: {
    submission: React.PropTypes.object.isRequired,
    index: React.PropTypes.number.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function () {
    return (
      <View style={styles.container}>

        <YouniHeader style={[styles.pageHeader, {backgroundColor: Colors.getPrimaryAppColor()}]}>
          <Image
            style={styles.logo}
            source={require('../../images/logoWhiteTextBlankBackground.png')}/>
          <BackArrow
            onPress={() => this.props.navigator.pop()}
            color="white"/>
        </YouniHeader>

        <Submission {...this.props}/>
        
        <View style={styles.statsContainer}>
          <Text style={[styles.rankingText, { color: Colors.getPrimaryAppColor() }]}>
            {this._getRankingText()}
          </Text>
        </View>

      </View>
    );
  },
  
  _getRankingText: function() {
    let place = this.props.index + 1;
    return `${this._getPlaceSuffix(place)} Place`;
  },

  // thank you internet: http://stackoverflow.com/questions/13627308/add-st-nd-rd-and-th-ordinal-suffix-to-a-number
  _getPlaceSuffix: function(i) {
    var j = i % 10,
        k = i % 100;

    if (j == 1 && k != 11) {
      return i + "st";
    }

    if (j == 2 && k != 12) {
      return i + "nd";
    }

    if (j == 3 && k != 13) {
      return i + "rd";
    }

    return i + "th";
  }
 
});

module.exports = CampusChallengeSubmissionPopup;
