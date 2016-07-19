'use strict';

var React = require('react-native');

var ChangeCoverImage = require('../Group/Admin/Edit/ChangeCoverImage');
var YouniHeader = require('../Common/YouniHeader');
var Spinner = require('../Common/Spinner');
var BackArrow = require('../Common/BackArrow');

var {
  View,
  Text,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerContentContainer: {
    flexDirection: 'row'
  },
  pageHeader: {
    flex: 1,
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    color: 'white'
  },
  cancelLink: {
    fontSize: 16,
    textAlign: 'left',
    color: 'white',
    padding: 12,
    paddingTop: 2,
    width: 75
  },
  finishEditLink: {
    fontSize: 16,
    textAlign: 'right',
    color: 'white',
    padding: 12,
    paddingTop: 2,
    width: 75
  }
});

var GroupUsersPopup = React.createClass({

  propTypes: {
    group: React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      name: React.PropTypes.string.isRequired,
      abbreviatedName: React.PropTypes.string.isRequired,
      description: React.PropTypes.string.isRequired,
      coverImageUrl: React.PropTypes.string.isRequired,
      badgeImageUrl: React.PropTypes.string.isRequired,
      adminEmails: React.PropTypes.array,
      allTimeTrendPoints: React.PropTypes.number.isRequired,
      numPosts: React.PropTypes.number.isRequired,
      numMembers: React.PropTypes.number.isRequired
    }).isRequired,
    onPageReturnCallback: React.PropTypes.func.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function () {
    return (
      <View style={styles.container}>

        <YouniHeader style={styles.headerContentContainer}>
          <Text
            style={styles.cancelLink}
            onPress={() => {
              this.props.onPageReturnCallback();
              this.props.navigator.pop();
            }}>
            Cancel
          </Text>
          <Text style={styles.pageHeader}>
            Edit Profile
          </Text>
          <Text
            style={styles.finishEditLink}
            onPress={() => {
              this.props.onPageReturnCallback();
              this.props.navigator.pop();
            }}>
            Done
          </Text>
        </YouniHeader>
        
        <ChangeCoverImage {...this.props}/>

      </View>
    );
  }

});

module.exports = GroupUsersPopup;
