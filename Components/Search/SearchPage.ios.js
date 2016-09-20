'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Icon = require('react-native-vector-icons/MaterialIcons');
var Unicycle = require('../../Unicycle');

var searchStore = require('../../stores/SearchStore');
var exploreFeedOrgsStore = require('../../stores/group/ExploreFeedOrgsStore');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var Colors = require('../../Utils/Common/Colors');
var SearchType = require('../../Utils/Enums/SearchType');
var InviteFriendsPage = require('../Profile/Settings/InviteFriendsPage');
var SearchBarInput = require('./SearchBarInput');
var SearchResultsList = require('./SearchResultsList');
var ExploreFeedPosts = require('../Post/ExploreFeedPosts');
var MostRecentOrgs = require('../Group/MostRecentOrgs');
var YouniHeader = require('../Common/YouniHeader');
var ListFilter = require('../Common/ListFilter');
var Spinner = require('../Common/Spinner');
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
  addContactsIcon: {
    position: 'absolute',
    right: 0,
    top: 0,
    paddingTop: 26,
    paddingRight: 16,
    paddingLeft: 30,
    paddingBottom: 15
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
          {this._renderInviteContactsButton()}
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

  _renderInviteContactsButton: function() {
    return (
      <TouchableHighlight
        style={styles.addContactsIcon}
        underlayColor="transparent"
        onPress={() => {
          this.props.navigator.push({
            component: InviteFriendsPage
          });
        }}>
        <Icon
          name='person-add'
          size={26}
          color='white'/>
      </TouchableHighlight>
    );
  },

  _renderSearchBar: function() {
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
        }}/>
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
