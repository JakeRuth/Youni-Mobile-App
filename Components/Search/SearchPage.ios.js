'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');

var searchStore = require('../../stores/SearchStore');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var Colors = require('../../Utils/Common/Colors');
var SearchType = require('../../Utils/Enums/SearchType');

var SearchBarInput = require('./SearchBarInput');
var SearchResultsList = require('./SearchResultsList');
var ExploreFeedPosts = require('../Post/ExploreFeedPosts');
var YouniHeader = require('../Common/YouniHeader');
var ListFilter = require('../Common/ListFilter');
var Spinner = require('../Common/Spinner');

var {
  View,
  Text,
  StyleSheet,
  ScrollView
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  searchResultsContainer: {
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
      searchPageContent = <ExploreFeedPosts navigator={this.props.navigator}/>;
    }
    else {
      searchPageContent = (
        <View style={styles.searchResultsContainer}>
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
        {searchPageContent}

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
  }

});

module.exports = SearchPage;
