'use strict';

var React = require('react-native');
var UserListItem = require('../Common/UserListItem');
var LoadMoreButton = require('../Common/LoadMoreButton');
var searchStore = require('../../stores/SearchStore');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

var {
  View,
  Text,
  ListView,
  StyleSheet,
  ScrollView,
  RecyclerViewBackedScrollView
} = React;

var styles = StyleSheet.create({
  container: {
    marginBottom: 55
  }
});

var SearchResultsList = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    return {
      dataSource: ds.cloneWithRows(searchStore.getSearchResults())
    };
  },

  render: function () {
    var that = this;

    return (
      <ScrollView style={styles.container}>
        <ListView
          initialListSize={searchStore.getSearchResults().length}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          pageSize={searchStore.getPageSize()}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}/>
        <LoadMoreButton
          onPress={() => {
            searchStore.fetchNextPage(userLoginMetadataStore.getEmail(), this._onFetchNextPageOfResults);
          }}
          isLoading={searchStore.isFetchingMoreResults()}
          isVisible={searchStore.moreResultsToFetch()}/>
      </ScrollView>
    );
  },

  _renderRow: function(user) {
    return (
      <UserListItem
        user={user}
        navigator={this.props.navigator}/>
    );
  },

  _onFetchNextPageOfResults: function(results) {
    var resultList = [];

    for (var i = 0; i < results.size; i++) {
      resultList.push(results.get(i));
    }

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(resultList)
    });
  }

});

module.exports = SearchResultsList;
