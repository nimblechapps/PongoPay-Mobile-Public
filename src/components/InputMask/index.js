import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Color from './../../utils/color';
import Label from './../Label'
import PropTypes from 'prop-types';
import styles from './styles';
import { TextInputMask } from 'react-native-masked-text';
import PhoneInput from 'react-native-phone-input';
import CustomIcon from "../CustomIcon";

class InputMask extends Component {

    constructor(props) {
        super(props)
        this.state = {
            // isvisible: props.secureTextEntry,
            // countryCode: "+44"
        }
    }

    render() {
        const { isNewTitle, LabelTitle, disabled, width, isCountryCode, isRightButton, reference, countryCode, onSelectCountry, mainContainerStyle, countryCodeContainerStyle, countryCodeTxtStyle } = this.props;
        // const { countryCode } = this.state;

        return (
            <View style={[styles.fieldViewStyle, mainContainerStyle, { width: width, justifyContent: 'space-between' }]}>


                {isNewTitle ? <Label mb={10} fontSize_20 Montserrat_Light color={Color.DarkGrey} >
                    {LabelTitle}
                </Label> :
                    <Label mb={10} fontSize_16 Montserrat_Light color={Color.DarkGrey} >
                        {LabelTitle}
                    </Label>}



                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                    {isCountryCode &&
                        <View style={[Globals.isIpad ? styles.countryCodeMainPad : styles.countryCodeMain, countryCodeContainerStyle]} >
                            <PhoneInput
                                disabled={disabled}
                                flagStyle={Globals.isIpad ? styles.flagViewPad : styles.flagView}
                                textStyle={[Globals.isIpad ? styles.flagCodeViewPad : styles.flagCodeView, countryCodeTxtStyle]}
                                // ref={(ref) => { this.phone = ref; }}
                                ref={reference}
                                value={countryCode.includes("+") ? countryCode : '+' + countryCode}
                                // onSelectCountry={() =>
                                //     this.setState({ countryCode: this.phone.getValue() })
                                //     // console.log(this.phone.getValue())
                                // }
                                onSelectCountry={onSelectCountry}
                            />
                            <CustomIcon name="arrowdown" style={Globals.isIpad ? styles.iconPadView : styles.iconMobileView} />
                        </View>
                    }

                    <TextInputMask
                        editable={!disabled}
                        type={this.props.type}
                        options={this.props.options}
                        style={[styles.fieldStyle, this.props.customStyle]}
                        keyboardType={this.props.keyboardType}
                        placeholder={this.props.placeholder}
                        onChangeText={this.props.onChangeText}
                        // autoFocus={this.props.autoFocus}
                        autoFocus={false}
                        value={this.props.value}
                        multiline={this.props.multiline}
                        secureTextEntry={this.props.secureTextEntry}
                        returnKeyType={this.props.returnKeyType}
                    // ref={this.props.reference}
                    // onSubmitEditing={this.props.onSubmitEditing}
                    // returnKeyType={this.props.returnKeyType}
                    />
                    {
                        isRightButton &&
                        <TouchableOpacity onPress={() => {
                            this.props.onPress(this.props.secureTextEntry)
                        }}
                            style={[styles.buttonStyle, this.props.rightButtonStyle]}>
                            <CustomIcon
                                name={(this.props.secureTextEntry ? this.props.hideIcon : this.props.showIcon)}
                                style={[styles.iconStyle, this.props.rightIconStyle]} />
                        </TouchableOpacity>
                    }
                </View>
                {this.props.children}
            </View >
        );
    }
}

InputMask.defaultProps = {
    title: "",
    separatorColor: Color.TEXTFIELD_TITLE,
    isCountryCode: false,
    isRightButton: false
};
InputMask.propTypes = {
    title: PropTypes.string,
    isCountryCode: PropTypes.bool
};

export default InputMask;
