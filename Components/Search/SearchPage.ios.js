'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');

var searchStore = require('../../stores/SearchStore');

var SearchTypeSelector = require('./SearchTypeSelector');
var SearchBarInput = require('./SearchBarInput');
var SearchResultsList = require('./SearchResultsList');
var ExploreFeedPosts = require('../Post/ExploreFeedPosts');
var YouniHeader = require('../Common/YouniHeader');
var EmptyResults = require('../Common/EmptyResults');
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
        numResults = searchStore.getNumResults(),
        searchPageContent;

    if (inExploreFeedView) {
      searchPageContent = <ExploreFeedPosts navigator={this.props.navigator}/>;
    }
    else if (numResults || searchStore.isFirstPageOfResultsLoading()) {
      searchPageContent = (
        <View style={styles.searchResultsContainer}>
          <SearchTypeSelector/>
          {this._renderSearchResultsList()}
        </View>
      );
    }
    else {
      searchPageContent = <EmptyResults message='no results to show'/>;
    }

    return (
      <View style={styles.container}>

        <YouniHeader>
          <SearchBarInput/>
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
