'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');

var {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  ActivityIndicatorIOS
} = React

var styles = StyleSheet.create({
  loadMoreIconContainer: {
    alignSelf: 'center'
  },
  loadMorePostsText: {
    padding: 10,
    margin: 5,
    backgroundColor: 'white',
    color: '#525252',
    borderRadius: 20
  },
  spinnerContainer: {
    alignSelf: 'center',
    paddingTop: 20,
    paddingBottom: 20
  }
});

var LoadMorePostsButton = React.createClass({

  propTypes: {
    onLoadMorePostsPress: React.PropTypes.func.isRequired,
    loadMorePostsRequestInFlight: React.PropTypes.bool
  },

  render: function() {
    var content;

    if (this.props.loadMorePostsRequestInFlight) {
      content = this.renderLoadingSpinner();
    }
    else {
      content = this.renderLoadMorePostsButton();
    }

    return (
      <View>
        {content}
      </View>
    );
  },

  renderLoadMorePostsButton: function() {
    return (
      <TouchableHighlight
        style={styles.loadMoreIconContainer}
        underlayColor='transparent'
        onPress={this.props.onLoadMorePostsPress}>

        <Text style={styles.loadMorePostsText}>
          Load more posts...
        </Text>

      </TouchableHighlight>
    );
  },

  renderLoadingSpinner: function() {
    return (
      <View style={styles.spinnerContainer}>
        <ActivityIndicatorIOS
          size="small"
          color="black"
          animating={true}
          style={styles.spinner} />
      </View>
    );
  },

});

module.exports = LoadMorePostsButton;
