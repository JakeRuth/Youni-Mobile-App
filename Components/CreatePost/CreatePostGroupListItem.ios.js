'use strict';

var React = require('react-native');

var PrettyTouchable = require('../Common/PrettyTouchable');

var createPostStore = require('../../stores/CreatePostStore');

var {
  View,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  container: {
    marginRight: 7,
    marginBottom: 7
  }
});

var CreatePostGroupListItem = React.createClass({

  propTypes: {
    groupIdString: React.PropTypes.string.isRequired,
    label: React.PropTypes.string.isRequired
  },

  render: function() {
    return (
      <View style={styles.container}>
        <PrettyTouchable
          label={this.props.label}
          containerStyle={{
            paddingTop: 7,
            paddingRight: 12,
            paddingBottom: 7,
            paddingLeft: 12,
            borderRadius: 6
          }}
          labelStyle={{
            fontSize: 14
          }}
          invertColors={!createPostStore.isGroupIdSelected(this.props.groupIdString)}
          onPress={() => {
            createPostStore.toggleGroupIdInList(this.props.groupIdString);
          }}/>
      </View>
    );
  }

});

module.exports = CreatePostGroupListItem;
