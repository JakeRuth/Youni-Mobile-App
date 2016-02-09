'use strict';

var React = require('react-native');
var MainScreenBanner = require('../../MainScreenBanner');
var BackArrow = require('./BackArrow');

var {
    View,
    StyleSheet,
    ScrollView,
    Dimensions
} = React;

var styles = StyleSheet.create({
    container: {
        height: Dimensions.get('window').height
    }
});

var OverlayPage = React.createClass({

    propTypes: {
        content: React.PropTypes.element.isRequired,
        onBackArrowPress: React.PropTypes.func.isRequired
    },

    render: function() {
        return (
            <View style={styles.container}>
                <MainScreenBanner title=''/>
                <ScrollView>
                    {this.props.content}
                </ScrollView>
                <BackArrow onPress={this.props.onBackArrowPress}/>
            </View>
        );
    }

});

module.exports = OverlayPage;
