'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');

var EditSettingsPage = require('../Profile/Settings/EditSettingsPage');
var YouniHeader = require('../Common/YouniHeader');
var Spinner = require('../Common/Spinner');
var BackArrow = require('../Common/BackArrow');

var editProfileInformationStore = require('../../stores/profile/EditProfileInformationStore');
var Colors = require('../../Utils/Common/Colors');

var {
  View,
  Text,
  AlertIOS,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  spinnerContainer: {
    marginTop: 10
  },
  headerContentContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  cancelLink: {
    fontSize: 16,
    textAlign: 'left',
    color: Colors.YOUNI_PRIMARY,
    padding: 12,
    paddingTop: 2
  },
  pageHeader: {
    flex: 1,
    color: Colors.YOUNI_PRIMARY,
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center'
  },
  finishEditLink: {
    fontSize: 16,
    textAlign: 'right',
    color: Colors.YOUNI_PRIMARY,
    padding: 12,
    paddingTop: 2
  }
});

var EditProfilePopup = React.createClass({

  propTypes: {
    user: React.PropTypes.object.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  mixins: [
    Unicycle.listenTo(editProfileInformationStore)
  ],

  render: function () {
    var content;

    if (editProfileInformationStore.isUpdateProfileInformationRequestInFlight()) {
      content = (
        <View style={styles.spinnerContainer}>
          <Spinner/>
        </View>
      );
    }
    else {
      content = (
        <EditSettingsPage {...this.props}/>
      );
    }

    return (
      <View style={styles.container}>

        <YouniHeader>
          <View style={styles.headerContentContainer}>

            <Text
              style={styles.cancelLink}
              onPress={() => { this.goBackOnePage(); }}>
              Cancel
            </Text>
            <Text style={styles.pageHeader}>
              Edit Profile
            </Text>
            <Text
              style={styles.finishEditLink}
              onPress={() => {
                if (!editProfileInformationStore.getFirstName() || !editProfileInformationStore.getLastName()) {
                  AlertIOS.alert(
                    'Fields cannot be blank.',
                    '',
                    [
                      {
                        text: 'Alright'
                      }
                    ]
                  );
                }
                else {
                  editProfileInformationStore.updateProfileInformation(this.goBackOnePage);
                }
              }}>
              Done
            </Text>

          </View>
        </YouniHeader>

        {content}

      </View>
    );
  },

  goBackOnePage: function() {
    this.props.navigator.pop();
  }

});

module.exports = EditProfilePopup;
