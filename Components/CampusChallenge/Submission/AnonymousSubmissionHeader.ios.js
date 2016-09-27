'use strict';

var React = require('react');
var ReactNative = require('react-native');

var PostActionButton = require('../../Post/PostActionButton');
var Emoji = require('../../Common/Emoji');

var Colors = require('../../../Utils/Common/Colors');

var {
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 70,
    flexDirection: 'row'
  },
  thumbnail: {
    padding: 10,
    flex: 1,
    flexDirection: 'row'
  },
  nameAndTimestampContainer: {
    flex: 1
  },
  anonymousEmojiContainer: {
    height: 40,
    width: 40,
    backgroundColor: Colors.LIGHT_GRAY,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  name: {
    fontSize: 16,
    marginLeft: 12,
    color: Colors.DARK_GRAY
  },
  timestamp: {
    flex: 1,
    marginTop: 5,
    fontSize: 13,
    marginLeft: 12,
    color: Colors.MED_GRAY
  },
  actionButtonContainer: {
    position: 'absolute',
    right: 12,
    top: 15
  }
});

// very similar to <PostHeader/>
var AnonymousSubmissionHeader = React.createClass({

  propTypes: {
    submission: React.PropTypes.object.isRequired
  },

  render: function() {
    return (
      <View style={styles.container}>

        <TouchableHighlight
          onPress={this.onProfilePress}
          underlayColor='transparent'>

          <View style={styles.thumbnail}>
            <View style={styles.anonymousEmojiContainer}>
              <Emoji
                name="sunglasses"
                size={25}/>
            </View>
            <View style={styles.nameAndTimestampContainer}>
              <Text
                style={styles.name}
                numberOfLines={1}>
                Anonymous
              </Text>
              <Text style={styles.timestamp}>
                {this.props.submission.timestamp}
              </Text>
            </View>
          </View>

        </TouchableHighlight>

        <View style={styles.actionButtonContainer}>
          <PostActionButton onPress={() => null}/>
        </View>

      </View>
    );
  }

});

module.exports = AnonymousSubmissionHeader;
