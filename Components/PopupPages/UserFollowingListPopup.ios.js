'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Unicycle = require('../../Unicycle');

var GetAllFollowingPage = require('../Profile/Following/GetAllFollowingPage');
var YouniHeader = require('../Common/YouniHeader');
var BackArrow = require('../Common/BackArrow');

var followRelationshipStore = require('../../stores/profile/FollowRelationshipStore');
var userLoginMetaDataStore = require('../../stores/UserLoginMetadataStore');
var Colors = require('../../Utils/Common/Colors');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var UserUtils = require('../../Utils/User/UserUtils');

var {
  View,
  Text,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  pageHeader: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center'
  }
});

var UserFollowingListPopup = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired
  },
  
  mixins: [
    Unicycle.listenTo(followRelationshipStore)
  ],

  componentDidMount() {
    followRelationshipStore.fetchFollowRelationships();
  },

  render: function () {
    return (
      <View style={styles.container}>
        <YouniHeader>
          <Text style={[styles.pageHeader, { color: Colors.getPrimaryAppColor() }]}>
            Following
          </Text>
          <BackArrow onPress={() => {
            // allow time for the navigator frame pop to take affect
            setTimeout(function() {
              followRelationshipStore.resetState();
            }, 200);
            this.props.navigator.pop();
          }}/>
        </YouniHeader>

        <GetAllFollowingPage
          initialPageLoading={followRelationshipStore.isInitialPageLoading()}
          isLoading={followRelationshipStore.isLoading()}
          moreToFetch={followRelationshipStore.getMoreToFetch()}
          onLoadMorePress={followRelationshipStore.fetchFollowRelationships}
          users={followRelationshipStore.getUsers()}
          selectedFilter={followRelationshipStore.getSelectedFilter()}
          onFilterPress={(filter) => followRelationshipStore.setSelectedFilter(filter)}
          navigator={this.props.navigator}/>
      </View>
    );
  }

});

module.exports = UserFollowingListPopup;
