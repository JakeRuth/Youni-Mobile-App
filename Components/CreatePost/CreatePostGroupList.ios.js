'use strict';

var React = require('react');
var ReactNative = require('react-native');

var CreatePostGroupListItem = require('./CreatePostGroupListItem');
var Spinner = require('../Common/Spinner');

var Colors = require('../../Utils/Common/Colors');

var {
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 15,
    paddingBottom: 15
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.LIGHT_GRAY
  },
  noGroupsMessage: {
    color: Colors.DARK_GRAY,
    fontWeight: '100',
    fontSize: 12
  },
  spinner: {
    alignSelf: 'flex-start'
  }
});

var CreatePostGroupList = React.createClass({

  propTypes: {
    groups: React.PropTypes.array,
    listItemSize: React.PropTypes.number.isRequired,
    isLoading: React.PropTypes.bool
  },

  render: function() {
    var content;

    if (this.props.isLoading) {
      content = <Spinner style={styles.spinner}/>;
    }
    else if (this.props.groups.length === 0) {
      content = (
        <Text style={styles.noGroupsMessage}>
          You don't belong to any groups on campus, get involved!
        </Text>
      );
    }
    else {
      content = this._renderGroups(this.props.groups);
    }

    return (
      <View style={styles.container}>
        {content}
      </View>
    );
  },

  _renderGroups: function(groups) {
    var groupElements = [];
    
    for (var i = 0; i < groups.length; i++) {
      let group = groups[i];
      groupElements.push(
        <CreatePostGroupListItem
          group={group}
          size={this.props.listItemSize}
          key={i}/>
      );
    }
    
    return groupElements;
  }

});

module.exports = CreatePostGroupList;
