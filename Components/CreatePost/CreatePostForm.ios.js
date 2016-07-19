'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');

var YouniHeader = require('../Common/YouniHeader');
var Spinner = require('../Common/Spinner');
var BackArrow = require('../Common/BackArrow');

var createPostStore = require('../../stores/CreatePostStore');
var tabStateStore = require('../../stores/TabStateStore');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var homePostsStore = require('../../stores/post/HomePostsStore');

var Colors = require('../../Utils/Common/Colors');
var TabLabel = require('../../Utils/Enums/TabLabel');

var {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  DeviceEventEmitter
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.get('window').height,
    backgroundColor: Colors.LIGHT_GRAY
  },
  pageHeader: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    color: 'white'
  },
  postImage: {
    flex: 1,
    justifyContent: "space-around",
    height: 250
  },
  captionInput: {
    flex: 1,
    fontSize: 16,
    height: 96,
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
    alignItems: 'center',
    backgroundColor: Colors.YOUNI_PRIMARY_PURPLE
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

  getInitialState: function () {
    return {
      isKeyboardVisible: false
    };
  },

  componentDidMount() {
    DeviceEventEmitter.addListener('keyboardWillShow', () => {
      this.setState({isKeyboardVisible: true});
    });
    DeviceEventEmitter.addListener('keyboardWillHide', () => {
      this.setState({isKeyboardVisible: false});
    });
  },

  mixins: [
    Unicycle.listenTo(createPostStore)
  ],

  render: function() {
    var imageUploadedSuccessfully = createPostStore.getImageId(),
        isPostUploading = createPostStore.isRequestInFlight(),
        containerStyles = [styles.container],
        postButton;

    // if the keyboard is showing, bump the post button up
    if (this.state.isKeyboardVisible) {
      containerStyles.push({ marginBottom: 256 });
    }

    if (!imageUploadedSuccessfully || isPostUploading) {
      postButton = (
        <View style={styles.createPostButton}>
          <Spinner color="white"/>
        </View>
      );
    }
    else {
      postButton = (
        <TouchableHighlight
          style={styles.createPostButton}
          underlayColor="transparent"
          onPress={this._onSubmitPost}>
          <Text style={styles.createPostText}>POST</Text>
        </TouchableHighlight>
      );
    }

    return (
      <View style={containerStyles}>

        <YouniHeader>
          <Text style={styles.pageHeader}>
            Create Post
          </Text>
          <BackArrow onPress={this._onBackArrowPress}/>
        </YouniHeader>

        <ScrollView automaticallyAdjustContentInsets={false}>
          <Image
            style={[styles.postImage, { height: this._getImageHeight() }]}
            resizeMode="contain"
            source={{uri: this.props.imageUri, isStatic: true}} />
          <TextInput
            style={styles.captionInput}
            placeholder="Add caption..."
            placeholderColor={Colors.MED_GRAY}
            onChangeText={(text) => { createPostStore.setCaption(text); }}
            value={createPostStore.getCaption()}
            multiline={true}
            keyboardType="twitter"
            maxLength={200}/>
        </ScrollView>
        {postButton}

      </View>
    );
  },

  _onSubmitPost: function() {
    var userId = userLoginMetadataStore.getUserId();
    
    Unicycle.exec('createPost', userId, () => {
      tabStateStore.setSelectedTab(TabLabel.HOME);
      homePostsStore.setScrollToTopOfPostFeed(true);
      Unicycle.exec('refreshHomeFeed', userLoginMetadataStore.getUserId());
      this.props.navigator.pop();
    });
  },

  _onBackArrowPress: function() {
    createPostStore.setCaption('');
    createPostStore.setImageId('');
    tabStateStore.setSelectedTab(TabLabel.HOME);
    this.props.navigator.pop();
  },

  _getImageHeight: function() {
    if (this.props.imageHeight >= this.MAX_IMAGE_HEIGHT) {
      return this.MAX_IMAGE_HEIGHT;
    }
    else {
      return this.props.imageHeight;
    }
  },

  MAX_IMAGE_HEIGHT: 250

});

module.exports = CreatePostForm;