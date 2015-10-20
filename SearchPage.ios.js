'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var Unicycle = require('./Unicycle');
var searchStore = require('./stores/SearchStore');
var MainScreenBanner = require('./MainScreenBanner');
var SearchBar = require('react-native-search-bar');

var {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  ScrollView
} = React

var styles = StyleSheet.create({
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
  }
});

var SearchPage = React.createClass({

  mixins: [
    Unicycle.listenTo(searchStore)
  ],

  render: function() {
    var searchPageContent;
    if (searchStore.getActiveSearch()) {
      searchPageContent = <SearchResultsList/>;
    }
    else {
      searchPageContent = <EmptySearchResults/>;
    }

    return (
      <View>
        <MainScreenBanner
          title="SUNY Albany"
          subTitle="Discover other students on campus"/>
        <SearchBar
          placeholder='Search for other students'
          onChangeText={ () => { Unicycle.exec('updateActiveSearch', true); } }
          onCancelButtonPress={ () => { Unicycle.exec('updateActiveSearch', false); } }/>
        {searchPageContent}
      </View>
    );
  }

});

//TODO Put some thought into whether or not these should be in their own files
var SearchResultsList = React.createClass({

  render: function() {
    var searchJson = searchStore.getSearchResults();
    var searchResults = [];
    for (var i = 0; i < searchJson.size; i++) {
      var search = searchJson.get(i);
      searchResults.push(<SearchResult key={i} search={search} />);
    }
    return (
      <ScrollView style={styles.scrollBar}>
        <View>
          {searchResults}
        </View>
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
        <TouchableHighlight underlayColor='lightgray'>
          <View style={styles.searchResult}>
            <Icon style={styles.profileImage}
              name="ios-person" size={40} color={this._hackyRandomHexCodeGenerator()} />
            <Text style={styles.fullName} numberOfLines={1}>{firstName} {lastName}</Text>
          </View>
        </TouchableHighlight>
        <View style={styles.blankLine} />
      </View>
    );
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
