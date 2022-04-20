import React, { Component } from "react";
import { View, } from "react-native";
import color from "../utils/color";
import Label from "./Label";
import { TouchableOpacity } from "react-native";

const RadioButton = (props) => {
    let { disabled } = props
    return (
        <View style={[{ flexDirection: 'row', padding: 5 }, props.style]}>
            <TouchableOpacity disabled={disabled} style={[{
                height: 20,
                width: 20,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: disabled ? color.DarkGrey : color.DarkBlue,
                alignItems: 'center',
                justifyContent: 'center',
            }]}
                onPress={() => { props.onChange() }}>
                {
                    props.selected ?
                        <View style={{
                            height: 12,
                            width: 12,
                            borderRadius: 6,
                            backgroundColor: disabled ? color.DarkGrey : color.DarkBlue,
                        }} />
                        : null
                }
            </TouchableOpacity>
            <View style={{ paddingHorizontal: 5 }}>
                <Label fontSize_16 Montserrat_Medium color={Color.DarkGrey} >{props.title}</Label>
                {props.children}
            </View>
        </View>
    )
}

RadioButton.defaultProps = {
    selected: false,
    title: '',
    disabled: false
}

export default RadioButton