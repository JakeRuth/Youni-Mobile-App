'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');

var TrendingList = require('./TrendingList');
var TrendingDropdownTrigger = require('./TrendingDropdownTrigger');
var TrendingFeedTypeDropdown = require('./TrendingFeedTypeDropdown');
var TrendingListItem = require('./TrendingListItem');
var UserListItem = require('../Common/UserListItem');
var YouniHeader = require('../Common/YouniHeader');
var ListFilter = require('../Common/ListFilter');
var ErrorPage = require('../Common/ErrorPage');
var GroupListItem = require('../Group/GroupListItem');
var RequestToCreateGroup = require('../Group/RequestToCreateGroup');

var trendingStore = require('../../stores/trending/TrendingStore');
var TrendingFeedFilters = require('../../Utils/Enums/TrendingFeedFilters');
var TrendingFeedType = require('../../Utils/Enums/TrendingFeedType');
var Colors = require('../../Utils/Common/Colors');

var {
  View,
  Text,
  StyleSheet,
  AlertIOS,
  Dimensions
} = React;

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
    trendingStore.requestTrendingGroups();
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
    );
  },

  _renderTrendingList: function() {
    if (trendingStore.getSelectedType().label == TrendingFeedType.STUDENTS.label) {
      return (
        <TrendingList
          isPageLoading={trendingStore.isTrendingUserRequestInFlight()}
          onPageRefresh={() => { trendingStore.requestTrendingUsers() }}
          navigator={this.props.navigator}>
          
          {this._renderTrendingUsers(trendingStore.getTrendingUsers())}
          
        </TrendingList>
      );
    }
    else {
      return (
        <TrendingList
          isPageLoading={trendingStore.isTrendingGroupRequestInFlight()}
          onPageRefresh={() => { trendingStore.requestTrendingGroups() }}
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
      trendingUsers.push(
        <TrendingListItem
          ranking={i + 1}
          key={i}>

          <UserListItem
            {...this.props}
            user={trendingUsersJson.get(i)}/>

        </TrendingListItem>
      );
    }

    return trendingUsers;
  },

  _renderTrendingGroups: function(trendingGroupsJson) {
    var trendingGroups = [];

    for (var i = 0; i<trendingGroupsJson.size; i++) {
      trendingGroups.push(
        <TrendingListItem
          ranking={i + 1}
          key={i}>

          <GroupListItem
            {...this.props}
            group={trendingGroupsJson.get(i).toJSON()}/>

        </TrendingListItem>
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
  }

});

module.exports = TrendingPage;
