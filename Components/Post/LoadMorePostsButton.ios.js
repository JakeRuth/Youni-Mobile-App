'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var Spinner = require('../Common/Spinner');

var {
  View,
  TouchableHighlight,
  StyleSheet
} = React

var styles = StyleSheet.create({
  loadMoreIconContainer: {
    alignSelf: 'center'
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
      content = (
          <Spinner
            color={'black'}/>
        );
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

        <Icon
          name='ios-plus-outline'
          size={60}
          color='#0083D4' />

      </TouchableHighlight>
    );
  }

});

module.exports = LoadMorePostsButton;
