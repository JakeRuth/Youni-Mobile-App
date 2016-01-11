'use strict'

var React = require('react-native');
var Unicycle = require('../../../Unicycle');
var userLoginMetadataStore = require('../../../stores/UserLoginMetadataStore');
var PostHeader = require('../PostHeader');
var PostStats = require('./PostStats');
var PostCommentsContainer = require('./PostCommentsContainer');

var {
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  postFooter: {
    backgroundColor: 'white'
  },
  caption: {
    fontSize: 14,
    fontWeight: '400',
    marginTop: 6,
    marginBottom: 6,
    color: '#666'
  },
  captionContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    marginLeft: 8,
    marginRight: 8
  }
});

var PostFooter = React.createClass({

  propTypes: {
    postStore: React.PropTypes.any.isRequired,
    postIdString: React.PropTypes.string.isRequired,
    numLikes: React.PropTypes.number.isRequired,
    caption: React.PropTypes.string.isRequired,
    liked: React.PropTypes.bool.isRequired,
    onStarPress: React.PropTypes.func.isRequired,
    firstComments: React.PropTypes.array,
    moreCommentsToShow: React.PropTypes.bool.isRequired,
    numComments: React.PropTypes.number.isRequired
  },

  render: function() {
    var caption = <View/>;

    // TODO: Fix this crap
    if (this.props.caption !== '_') {
      caption = (
        <View style={styles.captionContainer}>
          <Text style={styles.caption}>
            {this.props.caption}
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.postFooter}>

        {caption}

        <PostStats
          postStore={this.props.postStore}
          onStarPress={this.props.onStarPress(this.props.liked)}
          liked={this.props.liked}
          numLikes={this.props.numLikes}
          postIdString={this.props.postIdString} />

        <PostCommentsContainer
          postIdString={this.props.postIdString}
          postStore={this.props.postStore}
          firstComments={this.props.firstComments}
          moreCommentsToShow={this.props.moreCommentsToShow}
          numComments={this.props.numComments}/>

      </View>
    );
  }

});

module.exports = PostFooter;
