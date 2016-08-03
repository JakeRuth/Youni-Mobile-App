'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var Unicycle = require('../../Unicycle');

var ManageGroupPhotosList = require('../Group/Admin/ManageGroupPhotosList');
var YouniHeader = require('../Common/YouniHeader');
var Spinner = require('../Common/Spinner');

var Colors = require('../../Utils/Common/Colors');
var manageGroupPhotosStore = require('../../stores/group/ManageGroupPhotosStore');

var {
  View,
  Text,
  AlertIOS,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  loadingOverlay: {
    backgroundColor: 'rgba(0, 0, 0, .4)',
    opacity: .5
  },
  headerContentContainer: {
    flexDirection: 'row'
  },
  pageHeader: {
    flex: 1,
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    color: Colors.YOUNI_PRIMARY
  },
  cancelLink: {
    fontSize: 16,
    textAlign: 'left',
    color: Colors.YOUNI_PRIMARY,
    padding: 12,
    paddingTop: 2,
    width: 75
  },
  deletePhotosIcon: {
    width: 75,
    textAlign: 'right',
    paddingRight: 12,
    paddingTop: 2
  },
  contentContainer: {
    flex: 1
  },
  noPostsMessage: {
    flex: 1,
    padding: 30,
    marginTop: 100,
    fontSize: 14,
    fontWeight: '100',
    textAlign: 'center'
  }
});

var GroupManagePhotosPopup = React.createClass({

  propTypes: {
    group: React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      name: React.PropTypes.string.isRequired,
      abbreviatedName: React.PropTypes.string.isRequired,
      description: React.PropTypes.string.isRequired,
      coverImageUrl: React.PropTypes.string.isRequired,
      badgeImageUrl: React.PropTypes.string.isRequired,
      adminEmails: React.PropTypes.array,
      allTimeTrendPoints: React.PropTypes.number.isRequired,
      numPosts: React.PropTypes.number.isRequired,
      numMembers: React.PropTypes.number.isRequired
    }).isRequired,
    onPageReturnCallback: React.PropTypes.func.isRequired,
    navigator: React.PropTypes.object.isRequired
  },
  
  mixins: [
    Unicycle.listenTo(manageGroupPhotosStore)
  ],

  componentDidMount: function() {
    manageGroupPhotosStore.reInit();
    manageGroupPhotosStore.requestPosts(this.props.group.id);
  },

  render: function () {
    var posts = manageGroupPhotosStore.getPosts(),
        content;

    if (manageGroupPhotosStore.isLoading()) {
      content = <Spinner/>;
    }
    else if (posts.length) {
      content = (
        <ManageGroupPhotosList
          posts={posts}
          onLoadMorePostsPress={() => manageGroupPhotosStore.requestPosts(this.props.group.id)}
          noMorePostsToFetch={manageGroupPhotosStore.getNoMorePostsToFetch()}
          isNextPageLoading={manageGroupPhotosStore.isNextPageLoading()}/>
      );
    }
    else {
      content = (
        <Text style={styles.noPostsMessage}>
          There are no posts tagged for your group yet, so you can't remove anything.
        </Text>
      );
    }

    return (
      <View style={this._getContainerStyles()}>

        <YouniHeader style={styles.headerContentContainer}>
          <Text
            style={styles.cancelLink}
            onPress={() => {
              this.props.onPageReturnCallback();
              this.props.navigator.pop();
            }}>
            Cancel
          </Text>
          <Text style={styles.pageHeader}>
            Manage Photos
          </Text>
          <Icon
            style={[styles.deletePhotosIcon, { opacity: this._getDeleteIconOpacity() }]}
            size={20}
            name="android-delete"
            color={Colors.YOUNI_PRIMARY}
            onPress={this._onDeletePhotosPress}/>
        </YouniHeader>

        {content}

      </View>
    );
  },

  _onDeletePhotosPress: function() {
    var selectedPostsToDelete = manageGroupPhotosStore.getSelectedPostIdStrings();

    if (selectedPostsToDelete.length) {
      AlertIOS.alert(
        'Are you sure?',
        `You are about to remove ${selectedPostsToDelete.length} posts this group.`,
        [
          {
            text: 'Yes',
            onPress: () => {
              manageGroupPhotosStore.removePosts(this.props.group.id, this._deletePhotosCallback);
            }
          },
          {
            text: 'No'
          }
        ]
      );
    }
  },

  _deletePhotosCallback: function() {
    this.props.onPageReturnCallback();
    this.props.navigator.pop();
  },

  _getDeleteIconOpacity: function() {
    if (manageGroupPhotosStore.getSelectedPostIdStrings().length) {
      return 1;
    }
    else {
      return .5;
    }
  },
  
  _getContainerStyles: function() {
    var containerStyles = [styles.container];

    if (manageGroupPhotosStore.isDeletePostsRequestInFlight()) {
      containerStyles.push(styles.loadingOverlay);
    }
    
    return containerStyles;
  }

});

module.exports = GroupManagePhotosPopup;
