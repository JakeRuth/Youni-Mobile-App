'use strict';

var React = require('react-native');

var UserListItem = require('../Common/UserListItem');
var LoadMoreButton = require('../Common/LoadMoreButton');
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
  ScrollView,
  RecyclerViewBackedScrollView
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 5,
    marginBottom: 55
  },
  tempSearchTypeSelectorContainer: {
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  tempSearchTypeSelector: {
    flex: 1,
    color: Colors.DARK_GRAY,
    textAlign: 'center',
    fontSize: 14
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
      <View style={styles.container}>

        {this._renderSelector()}
        <ScrollView automaticallyAdjustContentInsets={false}>
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

      </View>
    );
  },

  /* This is temp until Jenny creates a design */
  _renderSelector: function() {
    return (
      <View style={styles.tempSearchTypeSelectorContainer}>
        <Text
          style={styles.tempSearchTypeSelector}
          onPress={() => {
              searchStore.setSearchType(SearchType.USER);
              searchStore.executeSearch(userLoginMetadataStore.getEmail());
            }}>
          Users
        </Text>
        <Text
          style={styles.tempSearchTypeSelector}
          onPress={() => {
              searchStore.setSearchType(SearchType.GROUP);
              searchStore.executeSearch();
            }}>
          Organizations
        </Text>
      </View>
    );
  },

  _renderRow: function(item) {
    if (searchStore.getSearchType() === SearchType.USER) {
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
