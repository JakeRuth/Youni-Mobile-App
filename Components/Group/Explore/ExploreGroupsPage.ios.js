'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Unicycle = require('../../../Unicycle');

var GroupResultsList = require('./GroupResultsList');
var GroupListItem = require('../../Group/GroupListItem');
var LoadMoreButton = require('../../Common/LoadMoreButton');
var ListFilter = require('../../Common/ListFilter');

var ExploreGroupFilters = require('../../../Utils/Enums/ExploreGroupFilters');
var Colors = require('../../../Utils/Common/Colors');
var exploreFeedOrgsStore = require('../../../stores/group/ExploreFeedOrgsStore');

var {
  View,
  Text,
  ScrollView,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  singleListSectionLabel: {
    textAlign: 'center',
    fontSize: 16,
    padding: 6
  }
});

var ExploreGroupsPage = React.createClass({

  MIN_GROUPS_REQUIRED_FOR_LIST_VIEW: 8,

  propTypes: {
    navigator: React.PropTypes.object.isRequired,
    forceListFilterView: React.PropTypes.bool,
    hidePublicGroups: React.PropTypes.bool,
    showQuickGroupActionButton: React.PropTypes.bool
  },

  mixins: [
    Unicycle.listenTo(exploreFeedOrgsStore)
  ],

  componentWillMount: function() {
    if (this.props.forceListFilterView) {
      exploreFeedOrgsStore.toggleFilter(ExploreGroupFilters.All);
    }
  },
  
  componentDidMount: function() {
    exploreFeedOrgsStore.fetchMostRecentOrgs();
    exploreFeedOrgsStore.fetchAllOrgsAlphabetically();
  },

  render: function () {
    let shouldRenderSingleListView = !this.props.forceListFilterView &&
      exploreFeedOrgsStore.getMostRecentGroups().length < this.MIN_GROUPS_REQUIRED_FOR_LIST_VIEW;
    if (shouldRenderSingleListView) {
      return this.renderSingleListView();
    }
    else {
      return this.renderListFilterView();
    }
  },

  renderListFilterView: function() {
    return (
      <View style={styles.container}>

        {this.renderListFilter()}

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

  renderListFilter: function() {
    if (!this.props.forceListFilterView) {
      return (
        <ListFilter
          filters={[ExploreGroupFilters.RECENT, ExploreGroupFilters.All]}
          selectedFilter={exploreFeedOrgsStore.getCurrentFilter()}
          onPress={(filter) => exploreFeedOrgsStore.toggleFilter(filter)}/>
      );
    }
  },

  renderSingleListView: function() {
    return (
      <View style={styles.container}>

        <ScrollView
          style={{flex: 1}}
          automaticallyAdjustContentInsets={false}>
          <View style={{flex: 1}}>

            <Text style={[styles.singleListSectionLabel, {color: Colors.getPrimaryAppColor()}]}>
              Recent
            </Text>
            {this._renderGroupsList()}

            <Text style={[styles.singleListSectionLabel, {color: Colors.getPrimaryAppColor()}]}>
              All
            </Text>
            <GroupResultsList
              groups={exploreFeedOrgsStore.getAllAlphabeticalGroups()}
              isInitialPageLoading={exploreFeedOrgsStore.isInitialFetchAllGroupsPageLoading()}
              isLoading={exploreFeedOrgsStore.isFetchingAllGroupsLoading()}
              moreToFetch={exploreFeedOrgsStore.getMoreAllGroupsToFetch()}
              onLoadMorePress={exploreFeedOrgsStore.fetchAllOrgsAlphabetically}
              navigator={this.props.navigator}/>

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
        <GroupResultsList
          groups={exploreFeedOrgsStore.getAllAlphabeticalGroups()}
          isInitialPageLoading={exploreFeedOrgsStore.isInitialFetchAllGroupsPageLoading()}
          isLoading={exploreFeedOrgsStore.isFetchingAllGroupsLoading()}
          moreToFetch={exploreFeedOrgsStore.getMoreAllGroupsToFetch()}
          onLoadMorePress={exploreFeedOrgsStore.fetchAllOrgsAlphabetically}
          hidePublicGroups={this.props.hidePublicGroups}
          showQuickGroupActionButton={this.props.showQuickGroupActionButton}
          navigator={this.props.navigator}/>
      );
    }
  }

});

module.exports = ExploreGroupsPage;
