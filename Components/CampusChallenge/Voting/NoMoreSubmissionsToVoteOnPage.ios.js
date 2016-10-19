'use strict';

var React = require('react');
var ReactNative = require('react-native');

var ChallengeActionButton = require('../ChallengeActionButton');

var Colors = require('../../../Utils/Common/Colors');
var campusChallengeStore = require('../../../stores/campusChallenge/CampusChallengeStore');

var {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    paddingHorizontal: Dimensions.get('window').width * .1,
    paddingVertical: 12
  },
  funnyGuyPic: {
    flex: 1,
    height: 200,
    width: Dimensions.get('window').width
  },
  checkBackText: {
    color: Colors.DARK_GRAY,
    fontSize: 30,
    textAlign: 'center',
    margin: 10
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginBottom: 5
  },
  enterChallengeButton: {
    height: 125,
    marginLeft: 5,
    marginRight: 2.5
  },
  viewSubmissionsButton: {
    height: 125,
    marginRight: 5,
    marginLeft: 2.5
  },
  viewSubmissionsButtonLabel: {
    flex: 1,
    fontSize: 25,
    textAlign: 'center',
    marginRight: 0
  }
});

var NoMoreSubmissionsToVoteOnPage = React.createClass({

  propTypes: {
    campusChallenge: React.PropTypes.object.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function () {
    return (
      <View style={styles.container}>

        <Text style={[styles.title, { color: Colors.getPrimaryAppColor() }]}>
          No More {this.props.campusChallenge.name} Submissions
        </Text>

        <Image
          style={styles.funnyGuyPic}
          resizeMode="contain"
          source={require('../../../images/noMoreSubmissions.png')}/>

        <Text style={styles.checkBackText}>
          Check Back Later!
        </Text>

        <View style={styles.buttonsContainer}>
          <ChallengeActionButton
            style={styles.enterChallengeButton}
            label="Enter"
            iconName="photo-camera"
            onPress={() => {
            this.props.navigator.push({
              component: require('../../PopupPages/SubmitCampusChallengePopup'),
              passProps: {
                campusChallenge: campusChallengeStore.getCurrentChallenge(),
                ...this.props
              }
            });
          }}/>
          <ChallengeActionButton
            style={styles.viewSubmissionsButton}
            buttonLabelStyle={styles.viewSubmissionsButtonLabel}
            label="View All Submissions"
            onPress={() => {
              this.props.navigator.push({
                component: require('../../PopupPages/AllCampusChallengeSubmissionsPopup'),
                passProps: {
                  campusChallenge: campusChallengeStore.getCurrentChallenge(),
                  ...this.props
                }
              })
            }}/>
        </View>

      </View>
    );
  }

});

module.exports = NoMoreSubmissionsToVoteOnPage;
