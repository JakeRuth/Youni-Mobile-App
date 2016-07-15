'use strict';

var React = require('react-native');

var YouniHeader = require('../Common/YouniHeader');
var Spinner = require('../Common/Spinner');
var BackArrow = require('../Common/BackArrow');

var {
  View,
  Text,
  ScrollView,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  pageHeader: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    color: 'white'
  }
});

var GroupAddNewMemberPopup = React.createClass({

  PAGE_SIZE: 40,

  propTypes: {
    group: React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      name: React.PropTypes.string.isRequired,
      description: React.PropTypes.string.isRequired,
      coverImageUrl: React.PropTypes.string.isRequired,
      badgeImageUrl: React.PropTypes.string.isRequired,
      adminEmails: React.PropTypes.array,
      allTimeTrendPoints: React.PropTypes.number.isRequired,
      numPosts: React.PropTypes.number.isRequired,
      numMembers: React.PropTypes.number.isRequired
    }).isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function () {
    return (
      <View style={styles.container}>

        <YouniHeader>
          <Text style={styles.pageHeader}>
            Add New Member
          </Text>
          <BackArrow onPress={() => { this.props.navigator.pop(); }}/>
        </YouniHeader>

      </View>
    );
  }

});

module.exports = GroupAddNewMemberPopup;
