'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');

var searchStore = require('../../stores/SearchStore');

var MainScreenBanner = require('../../MainScreenBanner');
var ExploreFeedPosts = require('../Post/ExploreFeedPosts');
var SearchBarInput = require('./SearchBarInput');
var SearchResultsList = require('./SearchResultsList');
var EmptyResults = require('../Common/EmptyResults');
var Spinner = require('../Common/Spinner');

var {
  View,
  StyleSheet,
  ScrollView
} = React;

var styles = StyleSheet.create({
  searchPageContainer: {
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

    if (searchStore.isFirstPageOfResultsLoading()) {
      searchPageContent = <Spinner/>;
    }
    else if (inExploreFeedView) {
      searchPageContent = <ExploreFeedPosts navigator={this.props.navigator}/>;
    }
    else if (numResults) {
      searchPageContent = <SearchResultsList navigator={this.props.navigator}/>;
    }
    else {
      searchPageContent = <EmptyResults message={'no results to show'}/>;
    }

    return (
      <View style={styles.searchPageContainer}>

        <MainScreenBanner title='Explore'/>
        <SearchBarInput/>
        {searchPageContent}

      </View>
    );
  }

});

module.exports = SearchPage;
