'use strict';

var React = require('react');
var ReactNative = require('react-native');

var UserListItem = require('../Common/UserListItem');
var LoadMoreButton = require('../Common/LoadMoreButton');
var EmptyResults = require('../Common/EmptyResults');
var GroupListItem = require('../Group/GroupListItem');

var searchStore = require('../../stores/SearchStore');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var SearchType = require('../../Utils/Enums/SearchType');
var Colors = require('../../Utils/Common/Colors');

var {
  View,
  Text,
  ListView,
  StyleSheet,
  RecyclerViewBackedScrollView
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 5
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
    if (!searchStore.getNumResults()) {
      return <EmptyResults message='no results to show'/>;
    }
    else {
      return (
        <View style={styles.container}>
          {this.props.children}
          <ListView
            initialListSize={searchStore.getSearchResults().length}
            dataSource={this.state.dataSource}
            renderRow={this._renderRow}
            renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}/>
          <LoadMoreButton
            onPress={() => {
              searchStore.fetchNextPage(userLoginMetadataStore.getEmail(), this._onFetchNextPageOfResults);
            }}
            isLoading={searchStore.isFetchingMoreResults()}
            isVisible={searchStore.moreResultsToFetch()}/>
        </View>
      );
    }
  },

  _renderRow: function(item) {
    if (searchStore.getSearchType() === SearchType.STUDENTS) {
      return (
        <UserListItem
          user={item}
          navigator={this.props.navigator}/>
      );
    }
    else {
      return (
        <GroupListItem
          group={item}
          navigator={this.props.navigator}/>
      );
    }
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
