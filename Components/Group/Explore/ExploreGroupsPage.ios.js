'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Unicycle = require('../../../Unicycle');

var GroupListItem = require('../../Group/GroupListItem');
var LoadMoreButton = require('../../Common/LoadMoreButton');
var ListFilter = require('../../Common/ListFilter');

var ExploreGroupFilters = require('../../../Utils/Enums/ExploreGroupFilters');
var exploreFeedOrgsStore = require('../../../stores/group/ExploreFeedOrgsStore');

var {
  View,
  Text,
  ScrollView,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 0
  }
});

var ExploreGroupsPage = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired
  },

  mixins: [
    Unicycle.listenTo(exploreFeedOrgsStore)
  ],
  
  componentDidMount: function() {
    exploreFeedOrgsStore.fetchMostRecentOrgs();
  },

  render: function () {
    return (
      <View style={styles.container}>

        <ListFilter
          filters={[ExploreGroupFilters.RECENT, ExploreGroupFilters.All]}
          selectedFilter={exploreFeedOrgsStore.getCurrentFilter()}
          onPress={(filter) => exploreFeedOrgsStore.toggleFilter(filter)}/>

        <ScrollView
          style={{flex: 1}}
          automaticallyAdjustContentInsets={false}>
          <View style={{flex: 1}}>
            {this._renderGroupsList()}
            <LoadMoreButton
              onPress={exploreFeedOrgsStore.fetchMostRecentOrgs}
              isLoading={exploreFeedOrgsStore.isFetchingMoreRecentGroupsLoading()}
              isVisible={exploreFeedOrgsStore.getMoreMostRecentGroupsToFetch()}/>
          </View>
        </ScrollView>

      </View>
    );
  },

  _renderGroupsList: function() {
    if (exploreFeedOrgsStore.getCurrentFilter() === ExploreGroupFilters.RECENT) {
      let groups = [],
          groupsJson = exploreFeedOrgsStore.getMostRecentGroups();

      for (var i = 0; i < groupsJson.length; i++) {
        groups.push(
          <GroupListItem
            group={groupsJson[i]}
            showLastPostTimestamp={true}
            navigator={this.props.navigator}/>
        );
      }

      return groups;
    }
    else {
      return (
        <Text>
          Best page ever.
        </Text>
      );
    }
  }

});

module.exports = ExploreGroupsPage;
