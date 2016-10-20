'use strict';

var React = require('react');
var ReactNative = require('react-native');
var clamp = require('clamp');

var {
  StyleSheet,
  Text,
  View,
  Animated,
  PanResponder,
  Image
}  = ReactNative;

var SWIPE_THRESHOLD = 120;

// Base Styles. Use props to override these values
var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  noMoreCardsText: {
    fontSize: 22,
  },
  yup: {
    borderColor: 'green',
    borderWidth: 2,
    position: 'absolute',
    padding: 20,
    bottom: 20,
    borderRadius: 5,
    right: 20,
  },
  yupText: {
    fontSize: 16,
    color: 'green',
  },
  nope: {
    borderColor: 'red',
    borderWidth: 2,
    position: 'absolute',
    bottom: 20,
    padding: 20,
    borderRadius: 5,
    left: 20,
  },
  nopeText: {
    fontSize: 16,
    color: 'red',
  }
});

var NoMoreCards = React.createClass({

  render() {
    return (
      <View>
        <Text style={styles.noMoreCardsText}>No more cards</Text>
      </View>
    )
  }

});

var CustomSwipeCards = React.createClass({

  getDefaultProps: function() {
    return {
      loop: false,
      showYup: true,
      showNope: true,
      containerStyle: styles.container,
      yupStyle: styles.yup,
      yupTextStyle: styles.yupText,
      nopeStyle: styles.nope,
      nopeTextStyle: styles.nopeText,
      indexOfLastCard: null
    };
  },

  getInitialState: function() {
    return {
      pan: new Animated.ValueXY(),
      enter: new Animated.Value(0.5),
      card: this.props.cards ? this.props.cards[0] : null
    };
  },

  _goToNextCard() {
    let currentCardIdx = this.props.cards.indexOf(this.state.card);
    let newIdx = currentCardIdx + 1;

    // Checks to see if last card.
    // If props.loop=true, will start again from the first card.
    let card = newIdx > this.props.cards.length - 1
      ? this.props.loop ? this.props.cards[0] : null
      : this.props.cards[newIdx];

    // Youni HACK
    // if there is no new card, keep it to the last card so that the render no card message never shows
    this.setState({
      card: card
    });
  },

  componentDidMount() {
    this._animateEntrance();
  },

  _animateEntrance() {
    Animated.spring(
      this.state.enter,
      { toValue: 1, friction: 8 }
    ).start();
  },

  componentWillReceiveProps(nextProps) {
    // Youni HACK
    // if there is no current card (state), that means that the loading screen is showing (aka renderNoMoreCards)
    if(!this.state.card && nextProps.cards && nextProps.cards.length > 0) {
      console.log('curren props: ', this.props.cards)
      console.log('next props: ', nextProps.cards)
      console.log('going to force set the next card! ', nextProps.cards[this.props.cards.length]);
      this.setState({
        card: nextProps.cards[this.props.cards.length]
      }, () => this._animateEntrance);
    }
    // Youni HACK
    // if the current card is not in the props passed in, we can assume it has been removed
    else if (nextProps.cards.indexOf(this.state.card) === -1) {
      this.setState({
        card: nextProps.cards[this.props.indexOfLastCard]
      },this._resetState);
    }
  },

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        return gestureState.dx != 0 && gestureState.dy != 0;
      },

      onPanResponderGrant: (e, gestureState) => {
        this.state.pan.setOffset({x: this.state.pan.x._value, y: this.state.pan.y._value});
        this.state.pan.setValue({x: 0, y: 0});
      },

      onPanResponderMove: Animated.event([
        null, {dx: this.state.pan.x, dy: this.state.pan.y},
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
            : this.props.handleNope(this.state.card)

          this.props.cardRemoved
            ? this.props.cardRemoved(this.props.cards.indexOf(this.state.card))
            : null

          Animated.decay(this.state.pan, {
            velocity: {x: velocity, y: vy},
            deceleration: 0.98
          }).start(this._resetState)
        } else {
          Animated.spring(this.state.pan, {
            toValue: {x: 0, y: 0},
            friction: 4
          }).start()
        }
      }
    })
  },

  _resetState() {
    this.state.pan.setValue({x: 0, y: 0});
    this.state.enter.setValue(0);
    this._goToNextCard();
    this._animateEntrance();
  },

  renderNoMoreCards() {
    if (this.props.renderNoMoreCards)
      return this.props.renderNoMoreCards();

    return (
      <NoMoreCards />
    )
  },

  renderCard(cardData) {
    return this.props.renderCard(cardData)
  },

  render() {
    let { pan, enter, } = this.state;

    let [translateX, translateY] = [pan.x, pan.y];

    let rotate = pan.x.interpolate({inputRange: [-200, 0, 200], outputRange: ["-30deg", "0deg", "30deg"]});
    let opacity = pan.x.interpolate({inputRange: [-200, 0, 200], outputRange: [0.5, 1, 0.5]});
    let scale = enter;

    let animatedCardstyles = {transform: [{translateX}, {translateY}, {rotate}, {scale}], opacity};

    let yupOpacity = pan.x.interpolate({inputRange: [0, 150], outputRange: [0, 1]});
    let yupScale = pan.x.interpolate({inputRange: [0, 150], outputRange: [0.5, 1], extrapolate: 'clamp'});
    let animatedYupStyles = {transform: [{scale: yupScale}], opacity: yupOpacity}

    let nopeOpacity = pan.x.interpolate({inputRange: [-150, 0], outputRange: [1, 0]});
    let nopeScale = pan.x.interpolate({inputRange: [-150, 0], outputRange: [1, 0.5], extrapolate: 'clamp'});
    let animatedNopeStyles = {transform: [{scale: nopeScale}], opacity: nopeOpacity}

    return (
      <View style={this.props.containerStyle}>
        { this.state.card
          ? (
          <Animated.View style={[this.props.cardStyle, animatedCardstyles]} {...this._panResponder.panHandlers}>
            {this.renderCard(this.state.card)}
          </Animated.View>
        )
          : this.renderNoMoreCards() }


        { this.props.renderNope
          ? this.props.renderNope(pan)
          : (
          this.props.showNope
            ? (
            <Animated.View style={[this.props.nopeStyle, animatedNopeStyles]}>
              {this.props.noView
                ? this.props.noView
                : <Text style={this.props.nopeTextStyle}>{this.props.noText ? this.props.noText : "Nope!"}</Text>
              }
            </Animated.View>
          )
            : null
        )
        }

        { this.props.renderYup
          ? this.props.renderYup(pan)
          : (
          this.props.showYup
            ? (
            <Animated.View style={[this.props.yupStyle, animatedYupStyles]}>
              {this.props.yupView
                ? this.props.yupView
                : <Text style={this.props.yupTextStyle}>{this.props.yupText? this.props.yupText : "Yup!"}</Text>
              }
            </Animated.View>
          )
            : null
        )
        }

      </View>
    );
  }

});

module.exports = CustomSwipeCards;