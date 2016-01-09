'use strict';

var React = require('react-native');
var Text = React.Text;
var Unicycle = require('../../Unicycle');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

var {
  View,
  Image,
  StyleSheet,
  NativeModules,
  TouchableHighlight
} = React

var styles = StyleSheet.create({
  postsAndFansCounterContainer: {
    flex: 2,
    flexDirection: 'row'
  },
  numPostsCounter: {
    flex: 1,
    margin: 10
  },
  verticalLineSeperator:{
    borderWidth: 1,
    marginVertical: 5,
    borderColor: 'grey'
  },
  numFansCounter: {
    flex: 1,
    margin: 10
  },
  postsAndFansCounterTitleText: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center'
  },
  postsAndFansCounter: {
    color: '#5375FA',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '600'
  },
  blankLine: {
    borderWidth: 1,
    borderColor: 'lightgray'
  }
});

var PostsAndFansCountContainer = React.createClass({

  propTypes: {
    viewerIsProfileOwner: React.PropTypes.bool.isRequired,
    coverImageUrl: React.PropTypes.string
  },

  render: function() {
    var content;

      content = this.renderPostsAndFansCounterContainer();

    return (
      <View style={styles.profileImageContainer}>
        {content}
      </View>
    );
  },

  renderPostsAndFansCounterContainer: function() {
    return (
      <View>
      <View style={styles.blankLine}/>
        <View style={styles.postsAndFansCounterContainer}>
          <View style={styles.numPostsCounter}>
            <Text style={styles.postsAndFansCounterTitleText}>Posts</Text>
            <Text style={styles.postsAndFansCounter}>43</Text>
          </View>
          <View style={styles.verticalLineSeperator}/>
          <View style={styles.numFansCounter}>
            <Text style={styles.postsAndFansCounterTitleText}>Fans</Text>
            <Text style={styles.postsAndFansCounter}>{this.props.numFans}</Text>
          </View>
        </View>
      <View style={styles.blankLine}/>
      </View>
    );
  },

});

module.exports = PostsAndFansCountContainer;
