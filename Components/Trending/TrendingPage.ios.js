'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Unicycle = require('../../Unicycle');

var TrendingList = require('./TrendingList');
var TrendingDropdownTrigger = require('./TrendingDropdownTrigger');
var TrendingFeedTypeDropdown = require('./TrendingFeedTypeDropdown');
var TrendingListItem = require('./TrendingListItem');
var YouniHeader = require('../Common/YouniHeader');
var ListFilter = require('../Common/ListFilter');
var ErrorPage = require('../Common/ErrorPage');
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

var {
  View,
  Text,
  StyleSheet,
  AlertIOS,
  Dimensions,
  TouchableWithoutFeedback
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  pageHeader: {
    color: 'white',
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center'
  },
  listContainer: {
    flex: 1,
    backgroundColor: Colors.LIGHT_GRAY,
    paddingTop: 5
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
    trendingStore.requestTrendingUsers();
  },

  render: function() {
    var anyErrorsLoadingPage = trendingStore.anyErrorsLoadingPage(),
        errorPage;

    if (anyErrorsLoadingPage) {
      errorPage = <ErrorPage reloadButtonAction={this._onErrorPageReload}/>
    }

    return (
      <View style={styles.container}>

        <YouniHeader color={Colors.getPrimaryAppColor()}>
          <Text style={styles.pageHeader}>
            Trending
          </Text>
        </YouniHeader>

        {errorPage}

        <ListFilter
          filters={[TrendingFeedType.STUDENTS.label, TrendingFeedType.ORGANIZATIONS.label]}
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
    if (trendingStore.getSelectedType() == TrendingFeedType.STUDENTS.label) {
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

          <View style={styles.requestToCreateGroupContainer}>
            <RequestToCreateGroup {...this.props}/>
          </View>
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

  _onErrorPageReload: function() {
    trendingStore.requestTrendingUsers();
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
