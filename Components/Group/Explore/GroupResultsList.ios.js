'use strict';

var React = require('react');
var ReactNative = require('react-native');

var GroupListItem = require('../../Group/GroupListItem');
var LoadMoreButton = require('../../Common/LoadMoreButton');
var Spinner = require('../../Common/Spinner');
var EmptyResults = require('../../Common/EmptyResults');

var Colors = require('../../../Utils/Common/Colors');

var {
  View,
  StyleSheet,
  ScrollView
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5
  },
  noGroupsMessage: {
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 100,
    fontSize: 16,
    color: Colors.MED_GRAY
  }
});

var GroupResultsList = React.createClass({

  propTypes: {
    groups: React.PropTypes.array.isRequired,
    isInitialPageLoading: React.PropTypes.bool.isRequired,
    isLoading: React.PropTypes.bool.isRequired,
    moreToFetch: React.PropTypes.bool.isRequired,
    onLoadMorePress: React.PropTypes.func.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function () {
    var groups = this.props.groups,
        content;

    if (this.props.isInitialPageLoading) {
      content = <Spinner/>;
    }
    else if (this.props.groups.length === 0) {
      content = <EmptyResults message="No groups found for search"/>;
    }
    else {
      let groupResults = [];
      for (var i = 0; i < groups.length; i++) {
        groupResults.push(
          <GroupListItem
            group={groups[i]}
            navigator={this.props.navigator}/>
        )
      }
      content = groupResults;
    }

    return (
      <ScrollView
        style={styles.container}
        automaticallyAdjustContentInsets={false}>

        {content}
        <LoadMoreButton
          onPress={this.props.onLoadMorePress}
          isLoading={this.props.isLoading}
          isVisible={this.props.groups.length && this.props.moreToFetch}/>

      </ScrollView>
    );
  }

});

module.exports = GroupResultsList;
