'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Icon = require('react-native-vector-icons/MaterialIcons');
var Unicycle = require('../../Unicycle');

var TrendingList = require('./TrendingList');
var TrendingListItem = require('./TrendingListItem');
var YouniHeader = require('../Common/YouniHeader');
var ListFilter = require('../Common/ListFilter');
var GroupListItem = require('../Group/GroupListItem');
var RequestToCreateGroup = require('../Group/RequestToCreateGroup');
var ProfilePopup = require('../PopupPages/ProfilePopup');
var GroupPopup = require('../PopupPages/GroupPopup');

var Colors = require('../../Utils/Common/Colors');
var IosStatusBarStyles = require('../../Utils/Common/IosStatusBarStyles');
var TrendingFeedFilters = require('../../Utils/Enums/TrendingFeedFilters');
var TrendingFeedType = require('../../Utils/Enums/TrendingFeedType');

var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var statusBarStyleStore = require('../../stores/StatusBarStyleStore');
var trendingStore = require('../../stores/trending/TrendingStore');
var mainAppSwipePageStore = require('../../stores/MainAppSwipePageStore');

var {
  View,
  Text,
  StyleSheet,
  AlertIOS,
  Dimensions,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  whatIsThisIcon: {
    position: 'absolute',
    left: 16,
    bottom: 10
  },
  homeNavButtonContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingTop: 26,
    paddingRight: 12,
    paddingLeft: 30,
    paddingBottom: 20
  },
  pageHeader: {
    color: 'white',
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center'
  },
  listContainer: {
    flex: 1
  },
  dropdownContainer: {
    position: 'absolute',
    top: 65,
    // centered horizontally. 185 should be the width of the dropdown
    left: (Dimensions.get('window').width - 185) / 2
  },
  requestToCreateGroupContainer: {
    alignItems: 'center'
  }
});

var TrendingPage = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired
  },

  mixins: [
    Unicycle.listenTo(trendingStore)
  ],

  componentDidMount: function() {
    trendingStore.requestFeedForCurrentSelection();
  },

  render: function() {
    return (
      <View style={styles.container}>

        <YouniHeader color={Colors.getPrimaryAppColor()}>
          <Text style={styles.pageHeader}>
            Trending
          </Text>
          {this._renderWhatIsThisPageIcon()}
          {this._renderHomeNavButton()}
        </YouniHeader>

        <View style={styles.requestToCreateGroupContainer}>
          <RequestToCreateGroup {...this.props}/>
        </View>

        <ListFilter
          filters={[TrendingFeedType.STUDENTS, TrendingFeedType.ORGANIZATIONS]}
          selectedFilter={trendingStore.getSelectedType()}
          onPress={(type) => trendingStore.setSelectedType(type)}/>

        <View style={styles.listContainer}>
          {this._renderTrendingList()}
        </View>

        <ListFilter
          filters={[TrendingFeedFilters.NOW, TrendingFeedFilters.SEMESTER]}
          selectedFilter={trendingStore.getSelectedFilter()}
          onPress={(filter) => trendingStore.setSelectedFilter(filter)}/>

      </View>
    );
  },

  _renderTrendingList: function() {
    if (trendingStore.getSelectedType() == TrendingFeedType.STUDENTS) {
      return (
        <TrendingList
          isPageLoading={trendingStore.isTrendingUserRequestInFlight()}
          onPageRefresh={() => {
            if (trendingStore.getSelectedFilter() === TrendingFeedFilters.NOW) {
              trendingStore.requestTrendingUsers();
            }
            else {
              trendingStore.requestSemesterTrendingUsers();
            }
          }}
          navigator={this.props.navigator}>

          {this._renderTrendingUsers(trendingStore.getTrendingUsers())}
          
        </TrendingList>
      );
    }
    else {
      return (
        <TrendingList
          isPageLoading={trendingStore.isTrendingGroupRequestInFlight()}
          onPageRefresh={() => {
            if (trendingStore.getSelectedFilter() === TrendingFeedFilters.NOW) {
              trendingStore.requestTrendingGroups();
            }
            else {
              trendingStore.requestSemesterTrendingGroups();
            }
          }}
          navigator={this.props.navigator}>

          {this._renderTrendingGroups(trendingStore.getTrendingGroups())}

        </TrendingList>
      );
    }
  },
  
  _renderTrendingUsers: function(trendingUsersJson) {
    var trendingUsers = [];

    for (var i = 0; i<trendingUsersJson.size; i++) {
      let user = trendingUsersJson.get(i),
          score;
      
      if (trendingStore.getSelectedFilter() === TrendingFeedFilters.NOW) {
        score = user.nowTrendingScore;
      }
      else {
        score = user.semesterTrendPoints;
      }

      trendingUsers.push(
        <TrendingListItem
          name={`${user.firstName} ${user.lastName}`}
          score={score}
          imageUrl={user.profileImageUrl}
          ranking={i + 1}
          onPress={() => this._onUserPress(user.email)}
          key={i}/>
      );
    }

    return trendingUsers;
  },

  _renderTrendingGroups: function(trendingGroupsJson) {
    var trendingGroups = [];

    for (var i = 0; i<trendingGroupsJson.size; i++) {
      let group = trendingGroupsJson.get(i).toJSON(),
          score;

      if (trendingStore.getSelectedFilter() === TrendingFeedFilters.NOW) {
        score = group.nowTrendingScore;
      }
      else {
        score = group.semesterTrendPoints;
      }

      trendingGroups.push(
        <TrendingListItem
          name={group.name}
          score={score}
          imageUrl={group.badgeImageUrl}
          ranking={i + 1}
          onPress={() => this._onGroupPress(group)}
          key={i}/>
      );
    }

    return trendingGroups;
  },

  _renderWhatIsThisPageIcon: function() {
    return (
      <TouchableHighlight
        style={styles.whatIsThisIcon}
        underlayColor="transparent"
        onPress={this._onWhatIsThisPageIconPress}>
        <Icon
          name='info-outline'
          size={25}
          color='white'/>
      </TouchableHighlight>
    );
  },

  _renderHomeNavButton: function() {
    return (
      <TouchableHighlight
        style={styles.homeNavButtonContainer}
        underlayColor="transparent"
        onPress={() => mainAppSwipePageStore.setSwipeFrameAmount(1)}>
        <Icon
          name='home'
          size={30}
          color='white'/>
      </TouchableHighlight>
    );
  },

  _onWhatIsThisPageIconPress: function() {
    AlertIOS.alert(
      'Welcome to the Trending Page!',
      "You're probably thinking, wtf is this, what are points?  On Youni every user, every group, has a campus score.  " +
      "As you post, gain followers, and have students interact with your content, your campus score will increase!  " +
      "Higher point values help you and your orgs get highlighted on our Trending Pages!!!",
      {
        text: 'Got it'
      }
    );
  },

  _onUserPress: function(userEmail) {
    if (userEmail !== userLoginMetadataStore.getEmail())

    this.props.navigator.push({
      component: ProfilePopup,
      passProps: {
        profileUserEmail: userEmail,
        onBackArrowPress: () => statusBarStyleStore.setStyle(IosStatusBarStyles.LIGHT_CONTENT)
      }
    })
  },

  _onGroupPress: function(group) {
    this.props.navigator.push({
      component: GroupPopup,
      passProps: { group: group }
    });
  }

});

module.exports = TrendingPage;
