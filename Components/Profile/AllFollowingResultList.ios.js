'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var Unicycle = require('../../Unicycle');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var EmptyResults = require('../Common/EmptyResults');
var Emoji = require('../Common/Emoji');

var {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  allFollowingListContainer: {
    flex: 1
  },
  scrollBar: {
    backgroundColor: 'transparent'
  },
  result: {
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10
  },
  profileImage: {
    height: 45,
    width: 45,
    borderRadius: 22,
    marginRight: 10
  },
  fullName: {
    flex: 4,
    fontSize: 20,
    alignSelf: 'center'
  },
  blankLine: {
    borderWidth: .3,
    borderColor: 'black',
    margin: 5
  }
});

var AllFollowingResultList = React.createClass({

  propTypes: {
    users: React.PropTypes.array.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    var content;

    if (!this.props.users.length) {
      content = <EmptyResults message={"You aren't following anyone!"}/>
    }
    else {
      content = this.renderResultList(this.props.users);
    }

    return (
      <View style={styles.allFollowingListContainer}>
        { content }
      </View>
    );
  },

  renderResultList: function(users) {
    var userResults = [];
    for (var i = 0; i < users.length; i++) {
      userResults.push(
        <Result
          key={i}
          user={users[i]}
          navigator={this.props.navigator}/>
      );
    }

    return (
      <ScrollView style={styles.scrollBar}>
        {userResults}
      </ScrollView>
    );
  }

});

var Result = React.createClass({

  propTypes: {
    user: React.PropTypes.object.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    var thumbnail;

    if (this.props.user.profileImageUrl) {
      thumbnail = (
        <Image style={styles.profileImage} source={{uri: this.props.user.profileImageUrl}}/>
      );
    }
    else {
      thumbnail = (
        <Icon style={styles.profileImage}
          name='ios-person' size={40} color='#5C7CFF' />
      );
    }

    return (
      <View>
        <TouchableHighlight
          underlayColor='transparent'
          onPress={this._onResultPress}>

          <View style={styles.result}>
            {thumbnail}

            <Text
              style={styles.fullName}
              numberOfLines={1}>
              {this.props.user.firstName} {this.props.user.lastName}
              {this._renderTrendingEmoji()}
            </Text>
          </View>

        </TouchableHighlight>
        <View style={styles.blankLine} />
      </View>
    );
  },

  _onResultPress: function() {
    var ProfilePopup = require('../PopupPages/ProfilePopup');
    this.props.navigator.push({
      component: ProfilePopup,
      passProps: {profileUserEmail: this.props.user.email}
    });
  },

  _renderTrendingEmoji: function() {
    if (this.props.user.isCurrentlyTrending) {
      return (
        <Emoji
          name="fire"
          size={20}/>
      );
    }
  }

});

module.exports = AllFollowingResultList;
