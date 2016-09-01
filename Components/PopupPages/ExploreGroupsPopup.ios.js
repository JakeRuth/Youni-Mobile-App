'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Icon = require('react-native-vector-icons/MaterialIcons');
var Unicycle = require('../../Unicycle');

var ExploreGroupsPage = require('../Group/Explore/ExploreGroupsPage');
var GroupResultsList = require('../Group/Explore/GroupResultsList');
var SearchBarInput = require('../Search/SearchBarInput');
var YouniHeader = require('../Common/YouniHeader');
var BackArrow = require('../Common/BackArrow');

var Colors = require('../../Utils/Common/Colors');
var exploreSearchOrgsStore = require('../../stores/group/ExploreSearchOrgsStore');

var {
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  pageHeader: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center'
  },
  searchIconContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingTop: 28,
    paddingRight: 12,
    paddingLeft: 30,
    paddingBottom: 15
  },
  searchBarContainer: {
    borderRadius: 5,
    marginLeft: 10,
    marginRight: 10
  }
});

var ExploreGroupsPopup = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired
  },

  mixins: [
    Unicycle.listenTo(exploreSearchOrgsStore)
  ],
  
  getInitialState: function() {
    return {
      showSearchBar: false
    }
  },

  render: function() {
    return (
      <View style={styles.container}>
        <YouniHeader>

          <Text style={[styles.pageHeader, {color: Colors.getPrimaryAppColor()}]}>
            Orgs
          </Text>

          <BackArrow onPress={() => this.props.navigator.pop()}/>

          <TouchableHighlight
            style={styles.searchIconContainer}
            underlayColor='transparent'
            onPress={this.toggleShowSearchBarState}>
            <Icon
              name='search'
              size={30}
              color={Colors.getPrimaryAppColor()}/>
          </TouchableHighlight>

        </YouniHeader>
        {this._renderContent()}
      </View>
    );
  },

  _renderContent: function() {
    if (this.state.showSearchBar) {
      return (
        <View style={{flex: 1}}>
          <SearchBarInput
            style={styles.searchBarContainer}
            value={exploreSearchOrgsStore.getSearchText()}
            active={true}
            placeholder='     Search Orgs'
            onChangeText={(search) => exploreSearchOrgsStore.setSearchText(search)}
            onSubmitEditing={() => exploreSearchOrgsStore.fetchSearchResults()}
            onClearSearchPress={() => {
              exploreSearchOrgsStore.setSearchText('');
              exploreSearchOrgsStore.setGroups([]);
              this.setState({
                showSearchBar: false
              });
            }}/>
          <GroupResultsList
            groups={exploreSearchOrgsStore.getGroups()}
            isInitialPageLoading={exploreSearchOrgsStore.isInitialPageLoading()}
            isLoading={exploreSearchOrgsStore.isLoading()}
            moreToFetch={exploreSearchOrgsStore.getMoreResults()}
            onLoadMorePress={exploreSearchOrgsStore.fetchSearchResults}
            navigator={this.props.navigator}/>
        </View>
      );
    }
    else {
      return (
        <ExploreGroupsPage navigator={this.props.navigator}/>
      );
    }
  },

  toggleShowSearchBarState: function() {
    this.setState({
      showSearchBar: !this.state.showSearchBar
    });
  }

});

module.exports = ExploreGroupsPopup;
