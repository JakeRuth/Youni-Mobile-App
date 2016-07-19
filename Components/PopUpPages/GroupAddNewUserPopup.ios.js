'use strict';

var React = require('react-native');

var AddGroupUserList = require('../Group/Admin/AddGroupUserList');
var SearchBarInput = require('../Search/SearchBarInput');
var YouniHeader = require('../Common/YouniHeader');
var Spinner = require('../Common/Spinner');
var BackArrow = require('../Common/BackArrow');
var EmptyResults = require('../Common/EmptyResults');

var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var Colors = require('../../Utils/Common/Colors');

var {
  View,
  Text,
  ScrollView,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  pageHeader: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    color: 'white'
  },
  searchBarContainer: {
    backgroundColor: 'white',
    padding: 10
  },
  spinnerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

var GroupAddNewMemberPopup = React.createClass({

  PAGE_SIZE: 25,

  propTypes: {
    group: React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      name: React.PropTypes.string.isRequired,
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

  getInitialState: function() {
    return {
      currentSearchTerm: '',
      isInitialPageLoading: false,
      isNextPageLoading: false,
      users: [],
      noResultsFound: false,
      moreToFetch: false,
      offset: 0
    };
  },

  render: function () {
    return (
      <View style={styles.container}>

        <YouniHeader>
          <Text style={styles.pageHeader}>
            Add New Member
          </Text>
          <BackArrow onPress={() => {
            this.props.onPageReturnCallback();
            this.props.navigator.pop();
          }}/>
        </YouniHeader>

        <View style={styles.searchBarContainer}>
          <SearchBarInput
            active={this.state.currentSearchTerm.length !== 0}
            value={this.state.currentSearchTerm}
            placeholder={`     Search for new members`}
            onChangeText={(search) => {
              this.setState({
                currentSearchTerm: search
              });
            }}
            onSubmitEditing={() => {
              this.setState({
                offset: 0,
                users: []
              });
              this.fetchGroupUsersToAdd();
            }}
            onClearSearchPress={() => {
              this.setState({
                users: [],
                currentSearchTerm: '',
                offset: 0,
                moreToFetch: false
              });
            }}/>
        </View>

        {this._renderUserList()}

      </View>
    );
  },

  _renderUserList: function() {
    if (this.state.isInitialPageLoading) {
      return <Spinner style={styles.spinnerContainer}/>;
    }
    else if (this.state.noResultsFound) {
      return <EmptyResults message="No results found"/>;
    }
    else {
      return (
        <AddGroupUserList
          users={this.state.users}
          groupIdString={this.props.group.id}
          isLoading={this.state.isNextPageLoading}
          moreToFetch={this.state.moreToFetch}
          onLoadMorePress={this.fetchGroupUsersToAdd}/>
      );
    }
  },
  
  fetchGroupUsersToAdd: function() {
    var that = this,
        currentUsers = this.state.users;

    if (this.state.offset === 0) {
      this.setState({
        isInitialPageLoading: true
      });
    }
    else {
      this.setState({
        isNextPageLoading: true
      });
    }

    AjaxUtils.ajax(
      '/group/searchForUsersToAdd',
      {
        searchTerm: this.state.currentSearchTerm,
        requestingUserIdString: userLoginMetadataStore.getUserId(),
        groupIdString: this.props.group.id,
        fetchOffset: this.state.offset,
        maxToFetch: this.PAGE_SIZE
      },
      (res) => {
        var noResultsFound = res.body.users.length === 0 && that.state.offset === 0;

        that.setState({
          users: currentUsers.concat(res.body.users),
          noResultsFound: noResultsFound,
          moreToFetch: res.body.moreToFetch,
          offset: that.state.offset + that.PAGE_SIZE,
          isInitialPageLoading: false,
          isNextPageLoading: false
        });
      },
      () => {
        that.setState({
          isInitialPageLoading: false,
          isNextPageLoading: false
        });
      }
    );
  }

});

module.exports = GroupAddNewMemberPopup;
