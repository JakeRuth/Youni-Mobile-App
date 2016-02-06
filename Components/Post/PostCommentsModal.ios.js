'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var postCommentsModalStore = require('../../stores/post/PostCommentsModalStore');
var PostHeader = require('../../Components/Post/PostHeader');
var PostCommentsContainer = require('../../Components/Post/Footer/PostCommentsContainer');
var Spinner = require('../Common/Spinner');

var {
  View,
  Text,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableHighlight
} = React

var styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25
  },
  hackyKeyboardBumpRoom: {
    paddingBottom: 250
  },
  closeModalButton: {
    alignSelf: 'center',
    backgroundColor: '#FF7878',
    marginTop: 10,
    padding: 10,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 3
  }
});

var PostCommentsModal = React.createClass({

  mixins: [
    Unicycle.listenTo(postCommentsModalStore)
  ],

  _setModalVisibility(isVisible) {
    postCommentsModalStore.setPostCommentsModalVisibile(isVisible);
  },

  render: function() {
    var isRequestInFlight = postCommentsModalStore.isRequestInFlight(),
        isModalVisible = postCommentsModalStore.getIsVisible(),
        content;

    if (isRequestInFlight) {
      content = (
        <Spinner/>
      );
    }
    else {
      content = this._renderModalContent();
    }

    return (
      <View>
        <Modal
          animated={false}
          visible={isModalVisible}>

          <View style={styles.container}>

            {content}
            {this._renderCloseModalButton()}

          </View>

        </Modal>
      </View>
    );
  },

  _renderModalContent: function() {
    return (
      <ScrollView style={styles.scrollContainer}>
        <PostHeader
          id={postCommentsModalStore.getId()}
          postIdString={postCommentsModalStore.getPostIdString()}
          posterEmail={postCommentsModalStore.getPosterEmail()}
          viewerIsPostOwner={false}
          posterName={postCommentsModalStore.getPosterName()}
          posterProfileImageUrl={postCommentsModalStore.getPosterProfileImageUrl()}
          timestamp={postCommentsModalStore.getTimestamp()}
          renderedFromProfileView={false}
          hideActionButton={true}/>

        <PostCommentsContainer
          id={postCommentsModalStore.getId()}
          posterEmail={postCommentsModalStore.getPosterEmail()}
          posterName={postCommentsModalStore.getPosterName()}
          timestamp={postCommentsModalStore.getTimestamp()}
          postIdString={postCommentsModalStore.getPostIdString()}
          postStore={postCommentsModalStore.getPostStore()}
          firstComments={postCommentsModalStore.getComments()}
          moreCommentsToShow={false}
          numComments={postCommentsModalStore.getNumComments()}/>

        <View style={styles.hackyKeyboardBumpRoom}/>

      </ScrollView>
    );
  },

  _renderCloseModalButton: function() {
    return (
      <TouchableHighlight
        onPress={() => {this._setModalVisibility(false)}}
        style={styles.closeModalButton}>
        <Text>Close</Text>
      </TouchableHighlight>
    );
  }

});

module.exports = PostCommentsModal;
