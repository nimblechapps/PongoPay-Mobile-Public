import React, { Component } from "react";
import { TextInput, View, StyleSheet } from "react-native";
import PropTypes from 'prop-types';
import { createStyles, minWidth } from 'react-native-media-queries';
import { fontSmall14 } from "../utils/theme";

export default class SearchBar extends Component {
    render() {
        const { placeholder, value, onChangeText, onEndEditing } = this.props;
        return (
            <View style={styles.container}>
                <TextInput
                    placeholder={placeholder}
                    value={value}
                    style={[styles.boxStyle, this.props.boxStyleCustom]}
                    onChangeText={onChangeText}
                    onEndEditing={onEndEditing}
                />
            </View>
        );
    }
}

SearchBar.defaultProps = {
    isFilter: false,
    isFilterButtonDisabled: false,
};

SearchBar.propTypes = {
    isFilter: PropTypes.bool,
    isFilterButtonDisabled: PropTypes.bool,
};

const base = StyleSheet.create({
    container: {
        flex: 1
    },
    boxStyle: {
        fontSize: fontSmall14,
        fontFamily: "Montserrat-Regular",
        height: 30,
        color: Color.BLACK,
        borderWidth: 1,
        borderColor: Color.LightGrey,
        borderRadius: 4,
        width: '100%',
        paddingLeft: 8,
        paddingRight: 8,
    },
});

const styles = createStyles(
    base,
    minWidth(480, {
        textStyle: {
            fontSize: fontSmall14,
        },
    }),
);