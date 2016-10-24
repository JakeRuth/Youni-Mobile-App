'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Icon = require('react-native-vector-icons/MaterialIcons');
var clamp = require('clamp');

var Colors = require('../Utils/Common/Colors');

var {
  Text,
  View,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
  PanResponder,
  TouchableHighlight
}  = ReactNative;

let AnimatedTouchableHighlight = Animated.createAnimatedComponent(TouchableHighlight);
let AnimatedIcon = Animated.createAnimatedComponent(Icon);

var SWIPE_THRESHOLD = 120;
var CARD_RENDER_COUNT_MAX = 5;
var MANUAL_SWIPE_ANIMATION_DURATION_MS = 400;
let {width, height} = Dimensions.get('window');

var styles = StyleSheet.create({
  cardContainer: {
    position: 'absolute',
    top: 0
  },
  voteControlContainer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 25,
    paddingBottom: 40
  },
  voteControl: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  voteControlButton: {
    backgroundColor: 'white',
    height: 80,
    width: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.DARK_TEXT_SHADOW,
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0
    }
  }
});

var CustomSwipeCards = React.createClass({

  propTypes: {
    cards: React.PropTypes.array.isRequired,
    renderCard: React.PropTypes.func.isRequired,
    handleYup: React.PropTypes.func.isRequired,
    handleNope: React.PropTypes.func.isRequired,
    cardRemoved: React.PropTypes.func.isRequired
  },

  getInitialState: function() {
    return {
      pan: new Animated.ValueXY(),
      currentCardIndex: 0,
      manualAnimationInRunning: false
    };
  },

  // this should remain the same
  componentWillMount() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        return gestureState.dx != 0 && gestureState.dy != 0;
      },

      // make sure card always starts in the center when the pan starts recording the users movements
      onPanResponderGrant: (e, gestureState) => {
        this.state.pan.setValue({x: 0, y: 0});
      },

      // the card will move around with the users finger as the finger slides
      onPanResponderMove: Animated.event([
        null, // raw event arg ignored
        {dx: this.state.pan.x, dy: this.state.pan.y}
      ]),

      // when the finger is released, check to see if the card with 'slid enough' to trigger a vote action
      onPanResponderRelease: (e, {vx, vy}) => {
        this.state.pan.flattenOffset();

        if (Math.abs(this.state.pan.x._value) > SWIPE_THRESHOLD) {
          this._handleCardRemoval();
        }
        else {
          // bring card back to center of the screen
          Animated.spring(this.state.pan, {
            toValue: {x: 0, y: 0},
            friction: 4
          }).start();
        }
      }
    })
  },

  render() {
    var cards = [],
        currCardIndex = this.state.currentCardIndex,
        lastVisibleCardIndex;

    if (currCardIndex + CARD_RENDER_COUNT_MAX > this.props.cards.length - 1) {
      lastVisibleCardIndex = this.props.cards.length - 1;
    }
    else {
      lastVisibleCardIndex = currCardIndex + CARD_RENDER_COUNT_MAX;
    }

    for (var i = currCardIndex; i <= lastVisibleCardIndex; i++) {
      let card;
      if (i === currCardIndex) {
        card = (
          <Animated.View style={this._getCurrentCardAnimationStyles()} {...this._panResponder.panHandlers}>
            {this.props.renderCard(this.props.cards[i])}
          </Animated.View>
        );
      }
      else if (i === currCardIndex + 1) {
        card = (
          <Animated.View style={this._getNextCardAnimationStyles()}>
            {this.props.renderCard(this.props.cards[i])}
          </Animated.View>
        );
      }
      else {
        card = (
          <View style={{opacity: 0}}>
            {this.props.renderCard(this.props.cards[i])}
          </View>
        );
      }

      cards.unshift(
        <View
          style={styles.cardContainer}
          key={i}>
          {card}
        </View>
      )
    }

    return (
      <View style={this.props.style}>

        {cards}
        <View style={styles.voteControlContainer}>
          {this._renderAnimatedNoIndicator()}
          {this._renderAnimatedYupIndicator()}
        </View>

      </View>
    );
  },

  _renderAnimatedNoIndicator: function() {
    let pan = this.state.pan,
        whiteToRed = pan.x.interpolate({
          inputRange: [-width, 0],
          outputRange: ['rgb(255, 0, 0)', 'rgb(255, 255, 255)'],
          extrapolate: 'clamp'
        }),
        redToWhite = pan.x.interpolate({
          inputRange: [-25, 0],
          outputRange: ['rgb(255, 255, 255)', 'rgb(255, 0, 0)'],
          extrapolate: 'clamp'
        });

    let onNopePress = function() {
      if (this.state.manualAnimationInRunning) {
        return;
      }

      // this manually triggers a swipe animation
      Animated.timing(
        pan.x,
        {
          toValue: -width,
          duration: MANUAL_SWIPE_ANIMATION_DURATION_MS,
          easing: Easing.linear
        },
      ).start();

      this.setState({ manualAnimationInRunning: true });
      setTimeout(function() {
        let currentCard = this.props.cards[this.state.currentCardIndex];
        this.props.handleNope(currentCard);
        this._goToNextCard();
        this.setState({ manualAnimationInRunning: false });
      }.bind(this), MANUAL_SWIPE_ANIMATION_DURATION_MS);

    }.bind(this);

    return (
      <View style={styles.voteControl}>
        <AnimatedTouchableHighlight
          style={[styles.voteControlButton, { backgroundColor: whiteToRed }]}
          underlayColor={Colors.LOUD_RED}
          onPress={onNopePress}>
          <AnimatedIcon
            style={{color: redToWhite}}
            name="clear"
            size={30}/>
        </AnimatedTouchableHighlight>
      </View>
    );
  },

  _renderAnimatedYupIndicator: function() {
    let pan = this.state.pan,
        whiteToGreen = pan.x.interpolate({
          inputRange: [0, width],
          outputRange: ['rgb(255, 255, 255)', 'rgb(0, 255, 0)'],
          extrapolate: 'clamp'
        }),
        greenToWhite = pan.x.interpolate({
          inputRange: [0, 25],
          outputRange: ['rgb(0, 255, 0)', 'rgb(255, 255, 255)'],
          extrapolate: 'clamp'
        });

    let onYupPress = function() {
      if (this.state.manualAnimationInRunning) {
        return;
      }

      // this manually triggers a swipe animation
      Animated.timing(
        pan.x,
        {
          toValue: width,
          duration: MANUAL_SWIPE_ANIMATION_DURATION_MS,
          easing: Easing.linear
        },
      ).start();

      this.setState({ manualAnimationInRunning: true });
      setTimeout(function() {
        let currentCard = this.props.cards[this.state.currentCardIndex];
        this.props.handleYup(currentCard);
        this._goToNextCard();
        this.setState({ manualAnimationInRunning: false });
      }.bind(this), MANUAL_SWIPE_ANIMATION_DURATION_MS);

    }.bind(this);

    return (
      <View style={styles.voteControl}>
        <AnimatedTouchableHighlight
          style={[styles.voteControlButton, { backgroundColor: whiteToGreen }]}
          underlayColor="lightgreen"
          onPress={onYupPress}>
          <AnimatedIcon
            style={{color: greenToWhite}}
            name="arrow-upward"
            size={30}/>
        </AnimatedTouchableHighlight>
      </View>
    );
  },

  _getCurrentCardAnimationStyles: function() {
    let pan = this.state.pan,
        [translateX, translateY] = [pan.x, pan.y],
        rotate = pan.x.interpolate({
          inputRange: [-200, 0, 200],
          outputRange: ["-30deg", "0deg", "30deg"]
        }),
        opacity = pan.x.interpolate({
          inputRange: [-200, 0, 200],
          outputRange: [0.25, 1, 0.25], extrapolate: 'clamp'
        });

    return {
      transform: [{translateX}, {translateY}, {rotate}],
      opacity
    };
  },

  _getNextCardAnimationStyles: function() {
    let pan = this.state.pan,
        fadeIn = pan.x.interpolate({
          inputRange: [-width, 0, width],
          outputRange: [.5, 0, .5],
          extrapolate: 'clamp'
        });

    return {
      opacity: fadeIn
    };
  },

  _handleCardRemoval: function() {
    let wasSwipeLeftToRight = this.state.pan.x._value > 0,
        currentCard = this.props.cards[this.state.currentCardIndex];

    if (wasSwipeLeftToRight) {
      this.props.handleYup(currentCard);
    }
    else {
      this.props.handleNope(currentCard);
    }

    this._goToNextCard();
  },

  _goToNextCard: function() {
    this.props.cardRemoved(this.state.currentCardIndex);
    this.state.pan.setValue({x: 0, y: 0});

    this.setState({
      currentCardIndex: this.state.currentCardIndex + 1
    });
  }

});

module.exports = CustomSwipeCards;