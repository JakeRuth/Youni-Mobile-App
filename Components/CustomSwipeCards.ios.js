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
  PanResponder,
  TouchableHighlight
}  = ReactNative;

let AnimatedTouchableHighlight = Animated.createAnimatedComponent(TouchableHighlight);
let AnimatedIcon = Animated.createAnimatedComponent(Icon);

var SWIPE_THRESHOLD = 120;
let {width, height} = Dimensions.get('window');

var styles = StyleSheet.create({
  voteControl: {
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
  },
  nopeControlPosition: {
    position: 'absolute',
    bottom: 22,
    left: 50
  },
  yupControlPosition: {
    position: 'absolute',
    bottom: 22,
    right: 50
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
      // this will change since we have multiple cards
      card: this.props.cards ? this.props.cards[0] : null
    };
  },

  _resetState() {
    this.state.pan.setValue({x: 0, y: 0});
    this._goToNextCard();
  },

  // this will have to be changed in some way to have x cards in rotation at a time
  // if there aren't enough cards to keep the rotation # constant, everytime this
  // function is called it will get closer and closer till one submission, then none.
  // At that point the parent component will either get more posts
  _goToNextCard() {
    let currentCardIdx = this.props.cards.indexOf(this.state.card);
    let newIdx = currentCardIdx + 1;

    let card = newIdx > this.props.cards.length - 1
      ? null
      : this.props.cards[newIdx];

    // Youni HACK
    // if there is no new card, keep it to the last card so that the render no card message never shows
    this.setState({
      card: card
    });
  },

  // this should remain the same
  componentWillMount() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        return gestureState.dx != 0 && gestureState.dy != 0;
      },

      onPanResponderGrant: (e, gestureState) => {
        this.state.pan.setValue({x: 0, y: 0});
      },

      onPanResponderMove: Animated.event([
        null, // raw event arg ignored
        {dx: this.state.pan.x, dy: this.state.pan.y}
      ]),

      onPanResponderRelease: (e, {vx, vy}) => {
        this.state.pan.flattenOffset();
        var velocity;

        if (vx >= 0) {
          velocity = clamp(vx, 3, 5);
        } else if (vx < 0) {
          velocity = clamp(vx * -1, 3, 5) * -1;
        }

        if (Math.abs(this.state.pan.x._value) > SWIPE_THRESHOLD) {
          this.state.pan.x._value > 0
            ? this.props.handleYup(this.state.card)
            : this.props.handleNope(this.state.card);

          this.props.cardRemoved
            ? this.props.cardRemoved(this.props.cards.indexOf(this.state.card))
            : null;

          Animated.decay(this.state.pan, {
            velocity: {x: velocity, y: vy},
            deceleration: 0.98
          }).start(this._resetState)
        }
        else {
          // bring card back to center of pan
          Animated.spring(this.state.pan, {
            toValue: {x: 0, y: 0},
            friction: 4
          }).start()
        }
      }
    })
  },

  render() {
    let pan = this.state.pan,
        [translateX, translateY] = [pan.x, pan.y],
        rotate = pan.x.interpolate({inputRange: [-200, 0, 200], outputRange: ["-30deg", "0deg", "30deg"]}),
        opacity = pan.x.interpolate({inputRange: [-200, 0, 200], outputRange: [0.25, 1, 0.25], extrapolate: 'clamp'}),
        animatedCardStyles = {
          transform: [{translateX}, {translateY}, {rotate}],
          opacity
        },
        card;

    // this will change
    if (this.state.card) {
      card = (
        <Animated.View style={animatedCardStyles} {...this._panResponder.panHandlers}>
          {this.props.renderCard(this.state.card)}
        </Animated.View>
      );
    }

    return (
      <View style={this.props.style}>

        {card}
        {this._renderAnimatedNoIndicator()}
        {this._renderAnimatedYupIndicator()}

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

    return (
      <View style={styles.nopeControlPosition}>
        <AnimatedTouchableHighlight
          style={[styles.voteControl, { backgroundColor: whiteToRed }]}
          underlayColor={Colors.LOUD_RED}
          onPress={() => /* TODO */ null}>
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

    return (
      <View style={styles.yupControlPosition}>
        <AnimatedTouchableHighlight
          style={[styles.voteControl, { backgroundColor: whiteToGreen }]}
          underlayColor="lightgreen"
          onPress={() => /* TODO */ null}>
          <AnimatedIcon
            style={{color: greenToWhite}}
            name="arrow-upward"
            size={30}/>
        </AnimatedTouchableHighlight>
      </View>
    );
  }

});

module.exports = CustomSwipeCards;