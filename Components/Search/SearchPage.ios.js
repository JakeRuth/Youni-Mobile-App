'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Unicycle = require('../../Unicycle');

var searchStore = require('../../stores/SearchStore');
var exploreFeedOrgsStore = require('../../stores/group/ExploreFeedOrgsStore');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var Colors = require('../../Utils/Common/Colors');
var SearchType = require('../../Utils/Enums/SearchType');

var SearchBarInput = require('./SearchBarInput');
var SearchResultsList = require('./SearchResultsList');
var ExploreFeedPosts = require('../Post/ExploreFeedPosts');
var MostRecentOrgs = require('../Group/MostRecentOrgs');
var YouniHeader = require('../Common/YouniHeader');
var ListFilter = require('../Common/ListFilter');
var Spinner = require('../Common/Spinner');

var {
  View,
  Text,
  StyleSheet,
  ScrollView
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  searchBarContainer: {
    borderRadius: 5,
    marginLeft: 10,
    marginRight: 10
  }
});

var SearchPage = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired
  },

  mixins: [
    Unicycle.listenTo(searchStore)
  ],

  render: function() {
    var inExploreFeedView = searchStore.getInExploreFeedView(),
        searchPageContent;

    if (inExploreFeedView) {
      searchPageContent = (
        <View style={{flex: 1}}>
          <MostRecentOrgs navigator={this.props.navigator}/>
          <ExploreFeedPosts navigator={this.props.navigator}/>
        </View>
      );
    }
    else {
      searchPageContent = (
        <View style={{flex: 1}}>
          <ListFilter
            filters={[SearchType.STUDENTS, SearchType.ORGANIZATIONS]}
            selectedFilter={searchStore.getSearchType()}
            onPress={(filter) => searchStore.executeSearch(userLoginMetadataStore.getEmail(), filter)}/>
          {this._renderSearchResultsList()}
        </View>
      );
    }

    return (
      <View style={styles.container}>

        <YouniHeader color={Colors.getPrimaryAppColor()}>
          <SearchBarInput
            style={styles.searchBarContainer}
            active={!searchStore.getInExploreFeedView()}
            value={searchStore.getSearchTerm()}
            placeholder={'     Search University'}
            onChangeText={(search) => {
              searchStore.setSearchTerm(search);
            }}
            onSubmitEditing={() => {
              var email = userLoginMetadataStore.getEmail();
              searchStore.executeSearch(email);
            }}
            onClearSearchPress={() => {
              searchStore.setSearchTerm('');
              searchStore.setInExploreFeedView(true);
            }}/>
        </YouniHeader>

        <ScrollView
          style={styles.container}
          onScroll={this.handleScroll}
          automaticallyAdjustContentInsets={false}>
          {searchPageContent}
        </ScrollView>

      </View>
    );
  },

  _renderSearchResultsList: function() {
    if (searchStore.isFirstPageOfResultsLoading()) {
      return <Spinner/>;
    }
    else {
      return <SearchResultsList navigator={this.props.navigator}/>;
    }
  },

  handleScroll(e) {
    var infiniteScrollThreshold = -1,
        userId = userLoginMetadataStore.getUserId();

    if (e.nativeEvent.contentOffset.y < infiniteScrollThreshold) {
      Unicycle.exec('refreshExploreFeed', userId, true);
      exploreFeedOrgsStore.requestTenMostRecentOrgs();
    }
  }

});

module.exports = SearchPage;
