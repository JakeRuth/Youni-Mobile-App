'use strict';

var React = require('react-native');
var explorePostsStore = require('../../stores/post/ExplorePostsStore');
var ExploreFeedEndpoints = require('../../Utils/Enums/ExploreFeedEndpoints');
var Colors = require('../../Utils/Common/Colors');
var PostListFilter = require('../../Utils/Enums/PostListFilter');

var {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: Dimensions.get('window').width * .6,
    height: 35
  },
  filterLabelContainer: {
    flex: 1
  },
  filterLabel: {
    color: Colors.YOUNI_PRIMARY_PURPLE,
    fontSize: 16,
    fontWeight: '100',
    textAlign: 'center'
  },
  selectedFilterUnderline: {
    position: 'absolute',
    left: (Dimensions.get('window').width * .6) / 12, // centers the line under the filter label
    width: 36,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.YOUNI_PRIMARY_PURPLE
  }
});

var FeedFilters = React.createClass({

  propTypes: {
    disabled: React.PropTypes.bool
  },

  getInitialState: function() {
    return {
      selectedFilter: PostListFilter.ALL
    };
  },

  render: function() {
    return (
      <View style={styles.container}>
        {this._renderFilterLabel(PostListFilter.MALE, 'Male')}
        {this._renderFilterLabel(PostListFilter.ALL, 'All')}
        {this._renderFilterLabel(PostListFilter.FEMALE, 'Female')}
      </View>
    );
  },

  _renderFilterLabel: function(filter, label) {
    return (
      <TouchableHighlight
        style={styles.filterLabelContainer}
        underlayColor="transparent"
        onPress={() => { this._onFilterPress(filter) }}>
        <View>
          <Text style={styles.filterLabel}>
            {label}
          </Text>
          {
            this.state.selectedFilter === filter &&
            <View style={styles.selectedFilterUnderline}/>
          }
        </View>
      </TouchableHighlight>
    );
  },

  _onFilterPress: function(selectedFilter) {
    if (!this.props.disabled) {
      explorePostsStore.setExploreFeedEndpoint(this._getExploreFeedEndpointForFilter(selectedFilter));
      this.setState({
        selectedFilter: selectedFilter
      });
    }
  },

  _getExploreFeedEndpointForFilter: function(selectedFilter) {
    if (selectedFilter === PostListFilter.ALL) {
      return ExploreFeedEndpoints.DEFAULT;
    }

    if (selectedFilter === PostListFilter.FEMALE) {
      return ExploreFeedEndpoints.FEMALE;
    }

    if (selectedFilter === PostListFilter.MALE) {
      return ExploreFeedEndpoints.MALE;
    }
  }

});

module.exports = FeedFilters;
