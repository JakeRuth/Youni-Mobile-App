'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Icon = require('react-native-vector-icons/MaterialIcons');
var Unicycle = require('../../Unicycle');

var searchStore = require('../../stores/SearchStore');
var exploreFeedOrgsStore = require('../../stores/group/ExploreFeedOrgsStore');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var mainAppSwipePageStore = require('../../stores/MainAppSwipePageStore');
var Colors = require('../../Utils/Common/Colors');
var SearchType = require('../../Utils/Enums/SearchType');

var SearchBarInput = require('./SearchBarInput');
var SearchResultsList = require('./SearchResultsList');
var ExploreFeedPosts = require('../Post/ExploreFeedPosts');
var MostRecentOrgs = require('../Group/MostRecentOrgs');
var YouniHeader = require('../Common/YouniHeader');
var ListFilter = require('../Common/ListFilter');
var Spinner = require('../Common/Spinner');
var NavButton = require('../Common/NavButton');
var CreatePostButton = require('../CreatePost/CreatePostButton');
var NotificationIcon = require('../Notification/NotificationIcon');

var {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  pageHeader: {
    flex: 1,
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    color: 'white'
  },
  notificationIcon: {
    position: 'absolute',
    left: 0,
    top: 0,
    paddingTop: 26,
    paddingLeft: 16,
    paddingRight: 30,
    paddingBottom: 15
  },
  searchBarContainer: {
    marginTop: 10,
    borderRadius: 5
  },
  searchIconContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingTop: 26,
    paddingRight: 12,
    paddingLeft: 30,
    paddingBottom: 15
  },
  trendingPageNavButtonContainer: {
    position: 'absolute',
    bottom: 14,
    left: 15
  },
  explorePageNavButtonContainer: {
    position: 'absolute',
    bottom: 14,
    right: 15
  },
  createPostButtonContainer: {
    position: 'absolute',
    bottom: 10,
    // center the button horizontally.  48 is the width on the button
    left: (Dimensions.get('window').width - 48) / 2
  }
});

var SearchPage = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      showSearchBar: false
    }
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
          {this._renderSearchBar()}
          <MostRecentOrgs navigator={this.props.navigator}/>
          <ExploreFeedPosts navigator={this.props.navigator}/>
        </View>
      );
    }
    else {
      searchPageContent = (
        <View style={{flex: 1}}>
          {this._renderSearchBar()}
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
          <Text style={styles.pageHeader}>
            Campus
          </Text>
          <NotificationIcon
            style={styles.notificationIcon}
            navigator={this.props.navigator}/>
          {this._renderSearchIcon()}
        </YouniHeader>

        <ScrollView
          style={styles.container}
          onScroll={this.handleScroll}
          automaticallyAdjustContentInsets={false}>
          {searchPageContent}
        </ScrollView>

        <View style={styles.trendingPageNavButtonContainer}>
          <NavButton
            onPress={() => mainAppSwipePageStore.setSwipeFrameAmount(-1)}
            iconName="equalizer"/>
        </View>
        <View style={styles.createPostButtonContainer}>
          <CreatePostButton navigator={this.props.navigator}/>
        </View>
        <View style={styles.explorePageNavButtonContainer}>
          <NavButton
            onPress={() => mainAppSwipePageStore.setSwipeFrameAmount(1)}
            iconName="explore"/>
        </View>

      </View>
    );
  },

  _renderSearchBar: function() {
    if (this.state.showSearchBar) {
      return (
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
            this.setState({
              showSearchBar: false
            });
          }}/>
      );
    }
  },

  _renderSearchResultsList: function() {
    if (searchStore.isFirstPageOfResultsLoading()) {
      return <Spinner/>;
    }
    else {
      return <SearchResultsList navigator={this.props.navigator}/>;
    }
  },

  _renderSearchIcon: function() {
    return (
      <TouchableHighlight
        style={styles.searchIconContainer}
        underlayColor='transparent'
        onPress={this.toggleShowSearchBarState}>
        <Icon
          name='search'
          size={30}
          color='white'/>
      </TouchableHighlight>
    );
  },

  handleScroll(e) {
    var infiniteScrollThreshold = -1,
        userId = userLoginMetadataStore.getUserId();

    if (e.nativeEvent.contentOffset.y < infiniteScrollThreshold) {
      Unicycle.exec('refreshExploreFeed', userId, true);
      exploreFeedOrgsStore.requestTenMostRecentOrgs();
    }
  },

  toggleShowSearchBarState: function() {
    this.setState({
      showSearchBar: !this.state.showSearchBar
    });
  }

});

module.exports = SearchPage;
