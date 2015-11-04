'use strict';

var React = require('react-native');
var MainScreenBanner = require('./MainScreenBanner');
var Icon = require('react-native-vector-icons/Ionicons');

var {
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} = React

var styles = StyleSheet.create({
  uploadPhotoPageContainer: {
    flex: 1
  }
});

var CreatePostPage = React.createClass({

  render: function() {
    return (
    <View style={styles.uploadPhotoPageContainer}>
      <MainScreenBanner
        title="Upload Photo"
        subTitle="An upload a day keeps the doctor away"/>
      <Text>To be implemented</Text>
    </View>
    )
  }

});

module.exports = CreatePostPage;
