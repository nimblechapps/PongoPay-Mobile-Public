import React, { Component } from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import PropTypes from 'prop-types';
import color from "../../utils/color";

export default class ProgressHud extends Component {
    render() {
        const { text } = this.props;
        return (
            <View style={styles.mainContainer}>
                <View style={styles.centerContainer}>
                    <ActivityIndicator
                        style={styles.indicatorStyle}
                        animating={true}
                        color={Color.WHITE}
                        size="large" />
                    <Text style={{ color: Color.WHITE, marginBottom: 10, marginLeft: 10, marginRight: 10 }}>
                        {text}
                    </Text>
                </View>
            </View>
        );
    }
}

ProgressHud.defaultProps = {
    text: "Please Wait...",
};

ProgressHud.propTypes = {
    text: PropTypes.string
};

const styles = StyleSheet.create({
    mainContainer: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        backgroundColor: color.TRANSPARENT,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 10
    },
    centerContainer: {
        backgroundColor: color.BLACK,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5
    },
    indicatorStyle: {
        alignSelf: "center",
        marginTop: 15,
        marginBottom: 10,
    }
});