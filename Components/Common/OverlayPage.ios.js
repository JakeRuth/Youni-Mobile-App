'use strict';

var React = require('react-native');
var MainScreenBanner = require('../../MainScreenBanner');
var BackArrow = require('./BackArrow');
var LogoutButton = require('./LogoutButton');

var {
    View,
    StyleSheet,
    ScrollView,
    Dimensions,
    DeviceEventEmitter
} = React;

var styles = StyleSheet.create({
    container: {
        height: Dimensions.get('window').height
    }
});

var OverlayPage = React.createClass({

    componentDidMount() {
        DeviceEventEmitter.addListener('keyboardWillShow', () => {
            this.setState({isKeyboardVisible: true});
        });
        DeviceEventEmitter.addListener('keyboardWillHide', () => {
            this.setState({isKeyboardVisible: false});
        });
    },

    getInitialState: function() {
        return {
            isKeyboardVisible: false,
            bottomOfScrollViewPosition: null
        };
    },

    propTypes: {
        content: React.PropTypes.any.isRequired,
        onBackArrowPress: React.PropTypes.func.isRequired,
        bannerTitle: React.PropTypes.string,
        bumpContentUpWhenKeyboardShows: React.PropTypes.bool,
        showLogoutButton: React.PropTypes.bool,
        navigator: React.PropTypes.object
    },

    render: function() {
        var contentOffset = {x:0,y:0},
            hackyKeyboardPadding;

        if (this.props.bumpContentUpWhenKeyboardShows && this.state.isKeyboardVisible) {
            contentOffset = {
                x: 0,
                y: this._computePositionToScrollToWhenKeyboardDisplayed()
            };
            hackyKeyboardPadding = (
              <View
                style={{height: 250}}
                onLayout={(e) => {
                    this.setState({
                        bottomOfScrollViewPosition: e.nativeEvent.layout.y
                    });
                }}/>
            );
        }

        return (
            <View style={styles.container}>
                <MainScreenBanner title={this.props.bannerTitle}/>
                <BackArrow onPress={this.props.onBackArrowPress}/>
                {this.props.showLogoutButton && <LogoutButton navigator={this.props.navigator}/>}

                <ScrollView
                  contentOffset={contentOffset}
                  automaticallyAdjustContentInsets={false}>

                    {this.props.content}

                    { /* This is a hacky way to compute the bottom of the scroll views position */ }
                    {hackyKeyboardPadding}

                </ScrollView>
            </View>
        );
    },

    _computePositionToScrollToWhenKeyboardDisplayed: function() {
        var spaceBetweenTopOfScreenAndTopOfKeyboard = (Dimensions.get('window').height - 300);
        return this.state.bottomOfScrollViewPosition - spaceBetweenTopOfScreenAndTopOfKeyboard;
    }

});

module.exports = OverlayPage;
