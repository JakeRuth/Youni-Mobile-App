'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var Unicycle = require('./Unicycle');
var searchStore = require('./stores/SearchStore');
var profileStore = require('./stores/profile/ProfileStore');
var MainScreenBanner = require('./MainScreenBanner');
var ProfilePageBody = require('./Components/Profile/ProfilePageBody');
var BackButton = require('./Components/Common/BackButtonBar');
var SearchBar = require('react-native-search-bar');
var EmptyResults = require('./Components/Common/EmptyResults');

var {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableHighlight,
  ActivityIndicatorIOS
} = React

var styles = StyleSheet.create({
  searchPageContainer: {
    flex: 1
  },
  scrollBar: {
    backgroundColor: 'transparent'
  },
  searchResult: {
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10
  },
  profileImage: {
    flex: 1
  },
  fullName: {
    flex: 4,
    fontSize: 20,
    alignSelf: 'center'
  },
  blankLine: {
    borderWidth: .3,
    borderColor: 'black',
    margin: 5
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

var SearchPage = React.createClass({

  mixins: [
    Unicycle.listenTo(searchStore),
    Unicycle.listenTo(profileStore)
  ],

  render: function() {
    var isProfileInView = searchStore.getInProfileView(),
        searchResultsToShow = searchStore.getSearchResults().size != 0,
        searchPageContent,
        searchPageHeader;

    if (searchStore.isRequestInFlight() || profileStore.isRequestInFlight()) {
      searchPageContent = <SearchResultLoading/>;
    }
    else if (isProfileInView) {
      searchPageContent = <ProfilePageBody
                            viewerIsProfileOwner = {false}
                            firstName = {profileStore.getFirstName()}
                            lastName = {profileStore.getLastName()}
                            bio = {profileStore.getBio()}
                            numFans = {profileStore.getNumFollowers()}
                            profileImageUrl = {profileStore.getProfileImageUrl()}
                            email = {profileStore.getEmail()}
                          />
    }
    else if (searchResultsToShow) {
      searchPageContent = <SearchResultsList/>;
    }
    else {
      searchPageContent = <EmptyResults message={'no results to show'}/>;
    }

    return (
      <View style={styles.searchPageContainer}>

        <MainScreenBanner
          title='SUNY Albany'
          subTitle='Discover other students on campus'/>
        {this._renderHeader()}
        {searchPageHeader}
        {searchPageContent}

      </View>
    );
  },

  _renderHeader: function() {
    var isProfileInView = searchStore.getInProfileView();

    if (isProfileInView) {
      return (
        <BackButton buttonOnPress={
            () => { Unicycle.exec('setInProfileView', false); }
        }/>
      );
    }
    else {
      return this._renderSearchBar();
    }
  },

  _renderSearchBar: function() {
    return (
      <SearchBar
        barTintColor='white'
        tintColor='#007C9E'
        placeholder='Search for other students'
        onChangeText={ (search) => { Unicycle.exec('executeSearch', search); } }
        onCancelButtonPress={ () => { Unicycle.exec('executeSearch', null); } }/>
    );
  }

});

//TODO Put some thought into whether or not these should be in their own files
var SearchResultsList = React.createClass({

  render: function() {
    var searchJson = searchStore.getSearchResults();
    var searchResults = [];

    for (var i = 0; i < searchJson.size; i++) {
      searchResults.push(<SearchResult
        key={i}
        search={searchJson.get(i)}
      />);
    }

    return (
      <ScrollView style={styles.scrollBar}>
        {searchResults}
      </ScrollView>
    );
  }

});

var SearchResult = React.createClass({

  propTypes: {
    search: React.PropTypes.object.isRequired
  },

  render: function() {
    var search = this.props.search;
    var firstName = search.get('firstName'),
        lastName = search.get('lastName'),
        email = search.get('email');

    return (
      <View>
        <TouchableHighlight
          underlayColor='lightgray'
          onPress={ () => {this._onSearchResultClick(email)} }>

          <View style={styles.searchResult}>
            <Icon style={styles.profileImage}
              name='ios-person' size={40} color={this._hackyRandomHexCodeGenerator()} />
            <Text style={styles.fullName} numberOfLines={1}>{firstName} {lastName}</Text>
          </View>

        </TouchableHighlight>
        <View style={styles.blankLine} />
      </View>
    );
  },

  _onSearchResultClick: function(email) {
    Unicycle.exec('reInitializeUsersProfileFeedOffset');
    Unicycle.exec('loadUsersProfile', email);
    Unicycle.exec('setInProfileView', true);
  },

  //straight from stackoverflow; +1
  _hackyRandomHexCodeGenerator: function() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

});

var SearchResultLoading = React.createClass({

  render: function() {
    return (
      <View style={styles.spinnerContainer}>
        <ActivityIndicatorIOS
          size="small"
          color="black"
          animating={true}
          style={styles.spinner} />
      </View>
    );
  }

});

module.exports = SearchPage;
