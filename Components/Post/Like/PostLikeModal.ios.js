'use strict';

var React = require('react-native');
var Unicycle = require('../../../Unicycle');
var postLikeModalStore = require('../../../stores/post/like/PostLikeModalStore');

var {
  View,
  Text,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  ActivityIndicatorIOS
} = React

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20
  },
  modalContainer: {
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 10
  },
  modalHeader: {
    color: 'darkgray'
  },
  likerListContainer: {
    alignItems: 'center'
  },
  likerListScroll: {
    margin: 20,
    padding: 20,
    height: 200
  },
  displayName: {
    padding: 2,
    fontSize: 20
  },
  closeModalButton: {
    backgroundColor: '#FF7878',
    marginTop: 10,
    padding: 10,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 3
  }
});

var PostLikeModal = React.createClass({

  mixins: [
    Unicycle.listenTo(postLikeModalStore)
  ],

  _setModalVisibility(isVisible) {
    Unicycle.exec('setIsModalVisible', isVisible);
  },

  render: function() {
    var isModalVisible = postLikeModalStore.getIsVisible(),
        isRequestInFlight = postLikeModalStore.isRequestInFlight(),
        likers = postLikeModalStore.getLikerDisplayNames(),
        content;

    var likerList = [];
    for (var i=0; i<likers.size; i++) {
      likerList.push(
        this._renderLikerNameText(likers.get(i))
      );
    }

    if (isRequestInFlight) {
      content = this._renderSmallSpinner();
    }
    else {
      content = this._renderModalContent(likerList);
    }

    return (
      <View>
        <Modal
          animated={true}
          transparent={true}
          visible={isModalVisible}>

          <View style={styles.container}>

            {content}

          </View>

        </Modal>
      </View>
    );
  },

  _renderModalContent: function(likerList) {
    return (
      <View style={styles.modalContainer}>
        <Text style={styles.modalHeader}>{this._getModalHeadingText(likerList.length)}</Text>

        <ScrollView style={styles.likerListScroll}>
          <View style={styles.likerListContainer}>
            {likerList}
          </View>
        </ScrollView>

        <TouchableHighlight
          onPress={() => {this._setModalVisibility(false)}}
          style={styles.closeModalButton}>
          <Text>Close</Text>
        </TouchableHighlight>
      </View>
    );
  },

  _renderLikerNameText: function(displayName) {
    return (
      <Text style={styles.displayName}>
        {displayName}
      </Text>
    );
  },

  _renderSmallSpinner: function() {
    return (
      <View style={styles.modalContainer}>
        <ActivityIndicatorIOS size={'small'} />
      </View>
    );
  },

  _getModalHeadingText: function(numLikers) {
    var studentSingularOrPlural = numLikers === 1 ? 'student' : 'students';
    return numLikers + ' ' + studentSingularOrPlural + ' liked this';
  }

});

module.exports = PostLikeModal;
