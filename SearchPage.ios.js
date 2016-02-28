'use strict';

var React = require('react-native');
var Unicycle = require('./Unicycle');
var Icon = require('react-native-vector-icons/Ionicons');
var searchStore = require('./stores/SearchStore');
var userLoginMetadataStore = require('./stores/UserLoginMetadataStore');
var MainScreenBanner = require('./MainScreenBanner');
var ExploreFeedPosts = require('./Components/Post/ExploreFeedPosts');
var EmptyResults = require('./Components/Common/EmptyResults');
var Spinner = require('./Components/Common/Spinner');
var ProfilePopup = require('./Components/PopupPages/ProfilePopup');

var {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  searchPageContainer: {
    flex: 1
  },
  searchBarInputContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ADADAD',
    backgroundColor: 'white'
  },
  searchBarInput: {
    height: 15
  },
  searchResultsScroll: {
    backgroundColor: 'transparent',
    marginBottom: 35
  },
  searchResult: {
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10
  },
  profileImage: {
    height: 45,
    width: 45,
    borderRadius: 22,
    marginRight: 10
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
        searchResultsToShow = searchStore.getSearchResults() != null,
        searchPageContent;

    if (searchStore.isRequestInFlight()) {
      searchPageContent = <SearchResultLoading/>;
    }
    else if (inExploreFeedView) {
      searchPageContent = (
        <ExploreFeedPosts navigator={this.props.navigator}/>
      );
    }
    else if (searchResultsToShow) {
      searchPageContent = <SearchResultsList navigator={this.props.navigator}/>;
    }
    else {
      searchPageContent = <EmptyResults message={'no results to show'}/>;
    }

    return (
      <View style={styles.searchPageContainer}>

        <MainScreenBanner title='Explore'/>
        {this._renderSearchBar()}
        {searchPageContent}

      </View>
    );
  },

  _renderSearchBar: function() {
    return (
      <View style={styles.searchBarInputContainer}>
        <TextInput style={styles.searchBarInput}
          placeholder='Search for students'
          blurOnSubmit={true}
          onChangeText={(search) => {
            var email = userLoginMetadataStore.getEmail();
            Unicycle.exec('executeSearch', search, email);
          }}
          clearButtonMode = 'always'/>
      </View>
    );
  }

});

//TODO Put some thought into whether or not these should be in their own files
var SearchResultsList = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    var searchJson = searchStore.getSearchResults();
    var searchResults = [];

    for (var i = 0; i < searchJson.size; i++) {
      searchResults.push(
        <SearchResult
          key={i}
          search={searchJson.get(i)}
          navigator={this.props.navigator}/>
      );
    }

    return (
      <ScrollView style={styles.searchResultsScroll}>
        {searchResults}
      </ScrollView>
    );
  }

});

var SearchResult = React.createClass({

  propTypes: {
    search: React.PropTypes.object.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    var search = this.props.search,
        firstName = search.get('firstName'),
        lastName = search.get('lastName'),
        email = search.get('email'),
        profileImageUrl = search.get('profileImageUrl'),
        thumbnail;

    if (profileImageUrl) {
      thumbnail = (
        <Image
          style={styles.profileImage}
          source={{uri: profileImageUrl}}/>
      );
    }
    else {
      thumbnail = (
        <Icon
          style={styles.profileImage}
          name='ios-person'
          size={40}
          color='#0083D4' />
      );
    }

    return (
      <View>
        <TouchableHighlight
          underlayColor='lightgray'
          onPress={ () => {this._onSearchResultClick(email)} }>

          <View style={styles.searchResult}>
            {thumbnail}
            <Text style={styles.fullName} numberOfLines={1}>{firstName} {lastName}</Text>
          </View>

        </TouchableHighlight>
        <View style={styles.blankLine}/>
      </View>
    );
  },

  _onSearchResultClick: function(email) {
    this.props.navigator.push({
      component: ProfilePopup,
      passProps: {profileUserEmail: this.props.search.get('email')}
    });
  }

});

var SearchResultLoading = React.createClass({

  render: function() {
    return (
      <Spinner/>
    );
  }

});

module.exports = SearchPage;
