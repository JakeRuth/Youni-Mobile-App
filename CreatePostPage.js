'use strict';

var React = require('react-native');
var MainScreenBanner = require('./MainScreenBanner');
var CreatePostButton = require('./Components/Post/CreatePostButton');

var {
  View,
  Text,
  StyleSheet,
} = React

var styles = StyleSheet.create({
  createPostPageContainer: {
    flex: 1
  }
});

var CreatePostPage = React.createClass({

  render: function() {
    return (
      <View style={styles.createPostPageContainer}>
        <MainScreenBanner
          title="Upload Photo"
          subTitle="An upload a day keeps the doctor away"/>
        <CreatePostButton/>
      </View>
    )
  }

});

module.exports = CreatePostPage;
