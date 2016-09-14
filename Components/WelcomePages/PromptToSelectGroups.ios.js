'use strict';

var React = require('react');
var ReactNative = require('react-native');

var ExploreGroupsPage = require('../Group/Explore/ExploreGroupsPage');
var RequestToCreateGroup = require('../Group/RequestToCreateGroup');

var Colors = require('../../Utils/Common/Colors');

var {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  joinGroupsContainer: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20
  },
  doneButton: {
    height: 50,
    width: Dimensions.get('window').width,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonLabel: {
    color: 'white',
    fontSize: 20
  },
  requestToCreateGroupContainer: {
    alignItems: 'center',
    paddingTop: 10
  }
});

var PromptToSelectGroups = React.createClass({
  
  propTypes: {
    onDonePress: React.PropTypes.func.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    return (
      <View style={[styles.container, this.props.style]}>

        <View style={styles.joinGroupsContainer}>
          <View style={styles.requestToCreateGroupContainer}>
            <RequestToCreateGroup
              labelOverride="Don't see your group? Request it!"
              navigator={this.props.navigator}/>
          </View>
          <ExploreGroupsPage
            forceListFilterView={true}
            hidePublicGroups={true}
            showQuickGroupActionButton={true}
            navigator={this.props.navigator}/>
        </View>

        <TouchableHighlight
          style={[styles.doneButton, { backgroundColor: Colors.getPrimaryAppColor() }]}
          underlayColor={Colors.getPrimaryAppColor()}
          onPress={this.props.onDonePress}>
          <Text style={styles.buttonLabel}>
            Done
          </Text>
        </TouchableHighlight>

      </View>
    );
  }

});

module.exports = PromptToSelectGroups;
