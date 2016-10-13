'use strict';

var React = require('react');
var ReactNative = require('react-native');

var CompetitionListItem = require('./CompetitionListItem');
var CompetitionInfoPopup = require('./CompetitionInfoPopup');
var YouniHeader = require('../Common/YouniHeader');
var Spinner = require('../Common/Spinner');
var LoadMoreButton = require('../Common/LoadMoreButton');
var RequestToCreateGroup = require('../Group/RequestToCreateGroup');

var Colors = require('../../Utils/Common/Colors');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

var {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  pageHeader: {
    color: 'white',
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center'
  },
  requestToCreateGroupContainer: {
    alignItems: 'center'
  },
  coverPhoto: {
    position: 'relative',
    height: Dimensions.get('window').width / 3, // keep 1:3 height:width ratio
    width: Dimensions.get('window').width,
    justifyContent: 'center'
  },
  title: {
    backgroundColor: 'transparent',
    color: Colors.WHITE_SMOKE,
    fontSize: 22,
    textAlign: 'center'
  },
  subtitle: {
    backgroundColor: 'transparent',
    color: Colors.WHITE_SMOKE,
    fontSize: 16,
    textAlign: 'center'
  },
  textShadow: {
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 3,
    textShadowColor: Colors.DARK_TEXT_SHADOW
  },
  popupContainer: {
    position: 'absolute',
    top: 0,
    left: 0
  },
  forceUpdateMessage: {
    fontSize: 18,
    textAlign: 'center',
    color: Colors.LOUD_RED
  }
});

// super temp replacement for the trending page before we axe it for good.  #BusinessInitiativesAreWack
var CompetitionPage = React.createClass({

  PAGE_SIZE: 50,

  propTypes: {
    navigator: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      groups: [],
      isInitialPageLoading: true,
      isNextPageLoading: false,
      offset: 0,
      moreToFetch: false,
      showPopup: userLoginMetadataStore.getShouldShowCompetitionPopup()
    };
  },

  componentDidMount: function() {
    this._fetchGroups();
  },

  render: function() {
    var content;

    // !!! This is here to force user's to update the app.
    if (userLoginMetadataStore.getShowUserUpdateMessageForFinishedCompetition()) {
      return this._renderHackyForceUpdateMessage();
    }
    if (this.state.isInitialPageLoading) {
      content = <Spinner/>;
    }
    else {
      content = [];
      
      for (let i = 0; i < this.state.groups.length; i++) {
        content.push(
          <CompetitionListItem
            key={i}
            ranking={i + 1}
            group={this.state.groups[i]}
            navigator={this.props.navigator}/>
        );
      }
    }
    
    return (
      <View style={styles.container}>

        <YouniHeader color={Colors.getPrimaryAppColor()}>
          <Text style={styles.pageHeader}>
            Competition Leaderboard
          </Text>
        </YouniHeader>

        <ScrollView
          style={{flex: 1}}
          onScroll={this._handleScroll}
          automaticallyAdjustContentInsets={false}>

          <TouchableHighlight
            underlayColor="transparent"
            onPress={() => this.setState({ showPopup: true })}>
            <Image
              style={styles.coverPhoto}
              resizeMode="cover"
              source={require('../../images/competitionPageCover.png')}>
              <Text style={[styles.title, styles.textShadow]}>
                $500 Party Competition
              </Text>
              <Text style={[styles.subtitle, styles.textShadow]}>
                Click here for rules
              </Text>
            </Image>
          </TouchableHighlight>

          <View style={styles.requestToCreateGroupContainer}>
            <RequestToCreateGroup {...this.props}/>
          </View>
          
          {content}
          
          <LoadMoreButton
            style={{marginBottom: 35}}
            onPress={this._fetchGroups}
            isLoading={this.state.isNextPageLoading}
            isVisible={this.state.moreToFetch}/>

        </ScrollView>

        {this._renderPopup()}
      </View>
    );
  },

  _renderPopup: function() {
    if (this.state.showPopup) {
      return (
        <View style={styles.popupContainer}>
          <CompetitionInfoPopup onPress={() => this.setState({ showPopup: false })}/>
        </View>
      );
    }
  },

  _fetchGroups: function() {
    var that = this,
        currGroups = this.state.groups;

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
      '/trending/fetchTopCompetitionGroups',
      {
        networkName: userLoginMetadataStore.getNetworkName(),
        fetchOffset: that.state.offset,
        maxToFetch: that.PAGE_SIZE
      },
      (res) => {
        that.setState({
          groups: currGroups.concat(res.body.groups),
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
  },

  _handleScroll(e) {
    var infiniteScrollThreshold = -1;
    var that = this;
    if (e.nativeEvent.contentOffset.y < infiniteScrollThreshold) {
      this.setState({
        groups: [],
        isInitialPageLoading: true,
        isNextPageLoading: false,
        offset: 0,
        moreToFetch: false
      }, this._fetchGroups);
    }
  },

  // since this is a temp feature I didn't care too much about code quality since we will delete this ina few weeks anyways
  _renderHackyForceUpdateMessage: function() {
    return (
      <View style={styles.container}>

        <YouniHeader color={Colors.getPrimaryAppColor()}>
          <Text style={styles.pageHeader}>
            Competition
          </Text>
        </YouniHeader>

        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
          <Text style={styles.forceUpdateMessage}>
            You are running an old version of Youni, please update before this version stops working
          </Text>
        </View>

      </View>
    );
  }

});

module.exports = CompetitionPage;
