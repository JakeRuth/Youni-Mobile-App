'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var PrettyTouchable = require('../Common/PrettyTouchable');
var Colors = require('../../Utils/Common/Colors');

var {
  View,
  StyleSheet,
  Text
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 75
  },
  message: {
    fontSize: 20,
    fontWeight: '300',
    textAlign: 'center',
    color: Colors.DARK_GRAY
  }
});

var NoPostsMessage = React.createClass({

  propTypes: {
    viewerIsProfileOwner: React.PropTypes.bool
  },

  render: function() {
    var postButton = <View/>;
    
    if (this.props.viewerIsProfileOwner) {
      postButton = (
        <PrettyTouchable
          label="Post"
          containerStyle={{
            marginTop: 30,
            width: 150,
            height: 44
          }}
          onPress={() => { Unicycle.exec('setSelectedTab', 'createPost');} }/>
      );
    }
    
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.message}>
            No posts yet
          </Text>
          {postButton}
        </View>
      </View>
    );
  }

});

module.exports = NoPostsMessage;
