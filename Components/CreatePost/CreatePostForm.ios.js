'use strict';

var React = require('react');
var ReactNative = require('react-native');
var DismissKeyboard = require('dismissKeyboard');
var Unicycle = require('../../Unicycle');

var SelectGroupsForPost = require('./SelectGroupsForPost');
var YouniHeader = require('../Common/YouniHeader');
var Spinner = require('../Common/Spinner');
var BackArrow = require('../Common/BackArrow');

var createPostStore = require('../../stores/CreatePostStore');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var homePostsStore = require('../../stores/post/HomePostsStore');
var statusBarStyleStore = require('../../stores/StatusBarStyleStore');

var Colors = require('../../Utils/Common/Colors');
var IosStatusBarStyles = require('../../Utils/Common/IosStatusBarStyles');

var {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  TouchableWithoutFeedback
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.get('window').height,
    backgroundColor: Colors.LIGHT_GRAY
  },
  pageHeader: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center'
  },
  imageAndCaptionContainer: {
    flex: 1,
    flexDirection: 'row',
    height: 110,
    paddingTop: 5,
    paddingBottom: 5,
    marginBottom: 5,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: Colors.LIGHT_GRAY
  },
  postImage: {
    backgroundColor: Colors.WHITE_SMOKE,
    alignSelf: 'center',
    width: 100,
    height: 100,
    margin: 5
  },
  captionInput: {
    flex: 1,
    fontSize: 16,
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 15,
    paddingLeft: 15,
    backgroundColor: 'white'
  },
  createPostButton: {
    bottom: 0,
    height: 50,
    width: Dimensions.get('window').width,
    alignItems: 'center'
  },
  createPostText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 22,
    fontWeight: '200',
    margin: 13
  }
});

var CreatePostForm = React.createClass({

  propTypes: {
    imageUri: React.PropTypes.string.isRequired,
    imageHeight: React.PropTypes.number.isRequired
  },

  mixins: [
    Unicycle.listenTo(createPostStore)
  ],

  render: function() {
    return (
      <TouchableWithoutFeedback
        style={styles.container}
        onPress={() => DismissKeyboard()}>
        <View style={{ flex: 1 }}>

          <YouniHeader>
            <Text style={[styles.pageHeader, { color: Colors.getPrimaryAppColor() }]}>
              Create Post
            </Text>
            <BackArrow onPress={this._onBackArrowPress}/>
          </YouniHeader>

          <ScrollView automaticallyAdjustContentInsets={false}>
            <View style={styles.imageAndCaptionContainer}>
              <TextInput
                style={styles.captionInput}
                placeholder="Add caption..."
                placeholderColor={Colors.MED_GRAY}
                onChangeText={(text) => { createPostStore.setCaption(text); }}
                value={createPostStore.getCaption()}
                multiline={true}
                keyboardType="twitter"
                maxLength={200}/>
              <Image
                style={styles.postImage}
                resizeMode="contain"
                source={{uri: this.props.imageUri, isStatic: true}} />
            </View>
            <SelectGroupsForPost/>
          </ScrollView>

          {this._renderPostButton()}
        </View>
      </TouchableWithoutFeedback>
    );
  },

  _renderPostButton: function() {
    var imageUploadedSuccessfully = createPostStore.getImageId(),
        isPostUploading = createPostStore.isRequestInFlight();

    if (!imageUploadedSuccessfully || isPostUploading) {
      return (
        <View style={[styles.createPostButton, { backgroundColor: Colors.getPrimaryAppColor() }]}>
          <Spinner color="white"/>
        </View>
      );
    }
    else {
      return (
        <TouchableHighlight
          style={[styles.createPostButton, { backgroundColor: Colors.getPrimaryAppColor() }]}
          underlayColor="transparent"
          onPress={this._onSubmitPost}>
          <Text style={styles.createPostText}>POST</Text>
        </TouchableHighlight>
      );
    }
  },

  _onSubmitPost: function() {
    var userId = userLoginMetadataStore.getUserId();
    
    Unicycle.exec('createPost', userId, () => {
      this._clearCreatePostData();
      homePostsStore.setScrollToTopOfPostFeed(true);
      Unicycle.exec('refreshHomeFeedData');
      Unicycle.exec('requestHomeFeed', userLoginMetadataStore.getUserId());

      statusBarStyleStore.setStyle(IosStatusBarStyles.LIGHT_CONTENT);
      this.props.navigator.pop();
    });
  },

  _onBackArrowPress: function() {
    statusBarStyleStore.setStyle(IosStatusBarStyles.LIGHT_CONTENT);
    this._clearCreatePostData();
    this.props.navigator.pop();
  },

  _clearCreatePostData: function() {
    createPostStore.setCaption('');
    createPostStore.setImageId('');
    createPostStore.setGroupIds([]);
  }

});

module.exports = CreatePostForm;
