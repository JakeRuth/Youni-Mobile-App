'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var Unicycle = require('./Unicycle');
var searchStore = require('./stores/SearchStore');
var profileStore = require('./stores/ProfileStore');
var MainScreenBanner = require('./MainScreenBanner');
var ProfilePage = require('./Components/Profile/ProfilePageBody');
var SearchBar = require('react-native-search-bar');

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
  backButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10
  },
  backButton: {
    fontSize: 15,
    color: '#007C9E',
    marginLeft: 10
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
  emptySearchResultsContainer: {
    flex: 1
  },
  emptySearchText: {
    flex: 1,
    alignSelf: 'center',
    marginTop: 200,
    color: 'darkgray'
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
    var isProfileInView = searchStore.getInProfileView();
    var searchResultsToShow = searchStore.getSearchResults().size != 0;
    var searchPageContent, searchPageHeader;

    if (isProfileInView) {
      searchPageHeader = this._renderBackButton();
    }
    else {
      searchPageHeader = this._renderSearchBar();
    }

    if (searchStore.isRequestInFlight() || profileStore.isRequestInFlight()) {
      searchPageContent = <SearchResultLoading/>;
    }
    else if (isProfileInView) {
      searchPageContent = <ProfilePage
                            firstName = {profileStore.getFirstName()}
                            lastName = {profileStore.getLastName()}
                            bio = {profileStore.getBio()}
                            numFans = {profileStore.getNumFollowers()}
                            profileImageUrl = {profileStore.getProfileImageUrl()}
                          />
    }
    else if (searchResultsToShow) {
      searchPageContent = <SearchResultsList/>;
    }
    else {
      searchPageContent = <EmptySearchResults/>;
    }

    return (
      <View style={styles.searchPageContainer}>
        <MainScreenBanner
          title='SUNY Albany'
          subTitle='Discover other students on campus'/>
        {searchPageHeader}
        {searchPageContent}
      </View>
    );
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
  },

  _renderBackButton: function() {
    return (
      <TouchableHighlight>
        <View style={styles.backButtonContainer}>
          <Icon name='ios-arrow-back' size={25} color='#007C9E' />
          <Text style={styles.backButton} onPress={ () => {Unicycle.exec('setInProfileView', false)} }>
            Back
          </Text>
        </View>
      </TouchableHighlight>
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

var EmptySearchResults = React.createClass({

  render: function() {
    return (
      <View style={styles.emptySearchResultsContainer}>
        <Text style={styles.emptySearchText}>No results to show</Text>
      </View>
    )
  }

});

module.exports = SearchPage;
