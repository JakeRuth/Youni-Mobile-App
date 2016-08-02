'use strict';

var React = require('react-native');

var GroupThumbnailLink = require('../Group/GroupThumbnailLink');
var Spinner = require('../Common/Spinner');

var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var Colors = require('../../Utils/Common/Colors');

var {
  Text,
  View,
  ScrollView,
  Dimensions,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: 47,
    paddingRight: 47
  },
  noGroupsMessage: {
    flex: 1,
    alignSelf: 'center',
    color: Colors.DARK_GRAY,
    fontSize: 12,
    textAlign: 'center',
    width: Dimensions.get('window').width * .5,
    marginTop: 35
  }
});

var ProfileGroups = React.createClass({

  propTypes: {
    user: React.PropTypes.object.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      groups: null
    };
  },

  componentDidMount: function() {
    this._requestUserGroups();
  },

  render: function() {
    var groups = [],
        content;
    
    if (this.state.groups === null) {
      return <Spinner color={Colors.YOUNI_PRIMARY}/>;
    }

    for (var i = 0; i < this.state.groups.length; i++) {
      groups.push(
        <GroupThumbnailLink
          style={{
            height: 84,
            width: (Dimensions.get('window').width - 94) / 4,
            alignItems: 'center'
          }}
          group={this.state.groups[i]}
          navigator={this.props.navigator}
          key={i}/>
      );
    }

    if (!groups.length) {
      content =  (
        <Text style={styles.noGroupsMessage}>
          {`${this.props.user.firstName} does not belong to any on campus groups.`}
        </Text>
      );
    }
    else {
      content = (
        <ScrollView style={{flex: 1}}>
          <View style={styles.container}>
            {groups}
          </View>
        </ScrollView>
      );
    }

    return (
      <View style={{flex: 1}}>
        {content}
        {this.props.children}
      </View>
    );
  },

  _requestUserGroups: function() {
    var that = this;

    AjaxUtils.ajax(
      '/user/getGroups',
      {
        userEmail: this.props.user.email
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
  }

});

module.exports = ProfileGroups;
