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

  getInitialState: function() {
    return {
      showDropdown: false
    };
  },

  render: function() {
    var anyErrorsLoadingPage = trendingStore.anyErrorsLoadingPage(),
        errorPage;

    if (anyErrorsLoadingPage) {
      errorPage = <ErrorPage reloadButtonAction={this._onErrorPageReload}/>
    }

    return (
      <TouchableWithoutFeedback onPress={() => this.setState({ showDropdown: false })}>
        <View style={styles.container}>

          <YouniHeader color={Colors.getPrimaryAppColor()}>
            <TrendingDropdownTrigger
              selectedType={trendingStore.getSelectedType()}
              onPress={this._toggleDropdownVisibility}
              isDropdownVisible={this.state.showDropdown}/>
          </YouniHeader>

          {errorPage}

          <ListFilter
            filters={[TrendingFeedFilters.NOW, TrendingFeedFilters.SEMESTER]}
            selectedFilter={trendingStore.getSelectedFilter()}
            onPress={(filter) => trendingStore.setSelectedFilter(filter)}/>
          {this._renderTrendingList()}
          {this._renderDropdown()}

        </View>
      </TouchableWithoutFeedback>
    );
  },

  _renderTrendingList: function() {
    if (trendingStore.getSelectedType().label == TrendingFeedType.STUDENTS.label) {
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
  
  _renderDropdown: function() {
    if (this.state.showDropdown) {
      return (
        <TrendingFeedTypeDropdown
          style={styles.dropdownContainer}
          onPress={() => this.setState({ showDropdown: false })}/>
      );
    }
  },

  _toggleDropdownVisibility: function() {
    var currentState = this.state.showDropdown;

    this.setState({
      showDropdown: !currentState
    });
  },

  _onErrorPageReload: function() {
    trendingStore.requestTrendingUsers();
  },

  _onUserPress: function(userEmail) {
    if (this.state.showDropdown) {
      this.setState({
        showDropdown: false
      });
      return;
    }

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
    if (this.state.showDropdown) {
      this.setState({
        showDropdown: false
      });
      return;
    }

    this.props.navigator.push({
      component: GroupPopup,
      passProps: { group: group }
    });
  }

});

module.exports = TrendingPage;
