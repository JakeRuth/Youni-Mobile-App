'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Icon = require('react-native-vector-icons/MaterialIcons');

var CreatePostGroupList = require('./CreatePostGroupList');

var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var Colors = require('../../Utils/Common/Colors');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');

var {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingLeft: 15,
    paddingRight: 15
  },
  showGroupsTrigger: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 45
  },
  triggerLabel: {
    flex: 1,
    color: Colors.DARK_GRAY,
    textAlign: 'left',
    fontSize: 14
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.LIGHT_GRAY
  }
});

var SelectGroupsForPost = React.createClass({

  getInitialState: function () {
    return {
      showGroups: true,
      groups: null
    };
  },

  componentWillMount: function() {
    this._getGroupsForUser();
  },

  render: function() {
    return (
      <View style={styles.container}>
        <View style={styles.separator}/>
        {this._renderTrigger()}
        {this._renderGroupList()}
      </View>
    );
  },

  _renderTrigger: function() {
    return (
      <TouchableHighlight
        underlayColor="transparent"
        onPress={this._toggleShowTagState}>

        <View style={styles.showGroupsTrigger}>
          <Text
            style={styles.triggerLabel}>
            Rep Your Group(s)
          </Text>
          <Icon
            name={this._getArrowIconName()}
            size={20}
            color='black'/>
        </View>

      </TouchableHighlight>
    );
  },

  _renderGroupList: function() {
    let size = (Dimensions.get('window').width - 30) / 4; // 30 = total horizontal padding
    
    if (this.state.showGroups) {
      return (
        <View>
          <CreatePostGroupList
            groups={this.state.groups}
            listItemSize={size}
            isLoading={this.state.groups === null}/>
          <View style={styles.separator}/>
        </View>
      );
    }
  },

  _getGroupsForUser: function() {
    var that = this;

    AjaxUtils.ajax(
      '/user/getGroups',
      {
        userEmail: userLoginMetadataStore.getEmail()
      },
      (res) => {
        that.setState({
          groups: res.body.groups
        });
      },
      () => {
        // TODO: Think of a better error state than this...
        that.setState({
          groups: []
        });
      }
    );
  },

  _toggleShowTagState: function() {
    var currentState = this.state.showGroups;

    this.setState({
      showGroups: !currentState
    });
  },

  _getArrowIconName: function() {
    if (this.state.showGroups) {
      return 'arrow-drop-up';
    }
    else {
      return 'arrow-drop-down';
    }
  }

});

module.exports = SelectGroupsForPost;
