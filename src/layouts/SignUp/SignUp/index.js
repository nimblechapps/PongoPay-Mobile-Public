import React, { Component } from 'react';
import { View, SafeAreaView, Image, TouchableOpacity, Linking } from 'react-native';
import CheckBox from "react-native-check-box";

import Label from '../../../components/Label'
import Color from "../../../utils/color"
import Globals from "../../../utils/Globals";
import TextField from '../../../components/TextField';
import KMButton from '../../../components/KMButton';
import styles from './styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { validateCharacter, validatePhone, validateName } from '../../../utils/validation';
import { fontXSmall16 } from '../../../utils/theme';
import { ErrorMessage } from '../../../utils/message';
import InputMask from '../../../components/InputMask';
import GlobalStyles from '../../../utils/GlobalStyles';
import HeaderLeft from '../../../components/Header/HeaderLeft';
import API from '../../../API';
import ProgressHud from '../../../components/ProgressHud';
// import ToastMessage from '../../../components/toastmessage';
import { Routes } from '../../../utils/Routes';
import CustomIcon from '../../../components/CustomIcon';

const images = {
    logoImage: require('../../../../src/assets/Images/logo.png')
}

export default class SignUp extends Component {

    static navigationOptions = ({ navigation }) => ({
        headerStyle: GlobalStyles.topbar,
        headerLeft: (
            <HeaderLeft
                iconName="left-arrow"
                iconStyle={{ paddingRight: 10, paddingLeft: 5, paddingTop: 10, paddingBottom: 10, }}
                onPress={() => {
                    navigation.goBack();
                }} />
        ),
    });

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            firstName: {
                value: "",
                message: "",
                isValid: false,
            },
            lastName: {
                value: "",
                message: "",
                isValid: false,
            },
            isTerms: false,

            phoneNumber: {
                value: "",
                message: "",
                isValid: false,
            },
            countryCode: Globals.countryCode,
            // toastData: {
            //     isShow: false,
            //     message: ""
            // },
        }
    }

    render() {
        const { isLoading, firstName, lastName, phoneNumber, countryCode, isTerms /*toastData*/ } = this.state;

        return (
            <SafeAreaView style={styles.container}>
                <View style={Globals.isIpad ? styles.scrollViewPad : styles.scrollView}>
                    <View style={Globals.isIpad ? styles.boxShadowViewPad : styles.boxShadowView}>
                        <KeyboardAwareScrollView scrollEnabled={true} enableOnAndroid={false} showsVerticalScrollIndicator={false}
                            style={{ flexGrow: 1 }}>
                            <View style={Globals.isIpad ? styles.logoMainViewPad : styles.logoMainView}>
                                <Image source={images.logoImage} style={Globals.isIpad ? styles.logoStylePad : styles.logoStyle} />
                            </View>
                            <View style={Globals.isIpad ? styles.mainViewPad : styles.mainView}>
                                <Label fontSize_16 color={Color.BLACK} mb={32} style={{ lineHeight: 24, }} >Please enter the following details to signup</Label>
                                <View>
                                    <TextField
                                        placeholder='First Name'
                                        LabelTitle='First Name'
                                        onChangeText={this.onFirstNameChange}
                                        value={firstName.value}
                                        autoFocus={true}
                                    // returnKeyType={ 'next' }
                                    // onSubmitEditing={() => { this.focusTheField('field2'); }}
                                    >
                                        {firstName.message !== "" &&
                                            <View style={Globals.isIpad ? GlobalStyles.errorTxtPad : GlobalStyles.errorTxt}>
                                                <CustomIcon name={"warning"} style={{ color: Color.Red, fontSize: fontXSmall16, alignItems: "center" }} />
                                                <Label fontSize_14 Montserrat_Regular color={Color.DarkGrey} style={{ paddingLeft: 10, }}>{firstName.message}</Label>
                                            </View>
                                        }
                                    </TextField>
                                </View>
                                <View style={{ zIndex: -1 }}>
                                    <TextField
                                        placeholder='Last Name'
                                        LabelTitle='Last Name'
                                        onChangeText={this.onLastNameChange}
                                        value={lastName.value}
                                    // autoFocus={true}
                                    >
                                        {lastName.message !== "" &&
                                            <View style={Globals.isIpad ? GlobalStyles.errorTxtPad : GlobalStyles.errorTxt}>
                                                <CustomIcon name={"warning"} style={{ color: Color.Red, fontSize: fontXSmall16, alignItems: "center" }} />
                                                <Label fontSize_14 Montserrat_Regular color={Color.DarkGrey} style={{ paddingLeft: 10, }}>{lastName.message}</Label>
                                            </View>
                                        }
                                    </TextField>
                                </View>
                                <View style={{ zIndex: -11 }}>
                                    <InputMask
                                        type={'custom'}
                                        options={{ mask: '9999999999999' }}
                                        placeholder='Enter Phone Number'
                                        LabelTitle='Phone Number'
                                        onChangeText={this.onPhoneNumberChange}
                                        value={phoneNumber.value}
                                        keyboardType={"phone-pad"}
                                        returnKeyType={"done"}
                                        customStyle={{ width: "77%", height: 48 }}
                                        isCountryCode={true}
                                        reference={ref => this.phone = ref}
                                        countryCode={countryCode}
                                        // autoFocus={true}
                                        onSelectCountry={() => this.setState({ countryCode: this.phone.getValue() })}
                                    >
                                        {phoneNumber.message !== "" &&
                                            <View style={Globals.isIpad ? GlobalStyles.errorTxtPad : GlobalStyles.errorTxt}>
                                                <CustomIcon name={"warning"} style={{ color: Color.Red, fontSize: fontXSmall16, alignItems: "center" }} />
                                                <Label fontSize_14 Montserrat_Regular color={Color.DarkGrey} style={{ paddingLeft: 10, }}>{phoneNumber.message}</Label>
                                            </View>
                                        }
                                    </InputMask>
                                </View>
                                <TouchableOpacity >
                                    <CheckBox
                                        style={{ marginTop: 40, }}
                                        onClick={() => { this.setState({ isTerms: !isTerms }) }}
                                        checkedImage={<CustomIcon style={styles.checkedIcon} name="check" />}
                                        unCheckedImage={<View style={styles.checkIcon}></View>}
                                        isChecked={isTerms}
                                        rightTextView={
                                            <View style={{ paddingLeft: 10, paddingRight: 16 }}>
                                                <Label color={Color.BLACK}>I have read, and agree to the PongoPay </Label>
                                                {/* <TouchableOpacity onPress={() => Linking.openURL(Globals.termsServiceUrl)} > */}
                                                <Label onPress={() => Linking.openURL(Globals.termsServiceUrl)} color={Color.LightBlue}>Terms of Service  <Label color={Color.BLACK}>including the PongoPay Privacy Policy and Pongo Pay Licencing Agreement.</Label></Label>
                                                {/* </TouchableOpacity> */}

                                            </View>
                                        }
                                    />
                                </TouchableOpacity>
                                <KMButton
                                    fontSize_16 Montserrat_Medium
                                    color={Color.BLACK}
                                    title="Send Verification Code"
                                    textStyle={{ padding: 0 }}
                                    style={{ backgroundColor: this.isSubmitDisable() ? Color.GreyLightColor : Color.Yellow, marginTop: 16, alignItems: 'center', justifyContent: 'center', height: 48, zIndex: -111, marginBottom: (Globals.isIpad ? 0 : 30) }}
                                    disabled={this.isSubmitDisable()}
                                    onPress={this.onSendOtpClick}
                                />
                            </View>
                        </KeyboardAwareScrollView>
                    </View>
                </View>
                {/* <ToastMessage message={toastData.message} isVisible={toastData.isShow} /> */}
                {isLoading && <ProgressHud />}
            </SafeAreaView>
        );
    }

    onFirstNameChange = (text) => {
        const firstName = this.state.firstName
        firstName.value = text

        if (firstName.value.length == 0 || firstName.value == "") {
            firstName.message = ErrorMessage.firstNameRequired
            firstName.isValid = false
        } else if (!validateName(firstName.value)) {
            firstName.message = ErrorMessage.firstNameInvalid
            firstName.isValid = false
        } else {
            firstName.message = ""
            firstName.isValid = true
        }
        this.setState({
            firstName
        })
    }

    onLastNameChange = (text) => {
        const lastName = this.state.lastName
        lastName.value = text

        if (lastName.value.length == 0 || lastName.value == "") {
            lastName.message = ErrorMessage.lastNameRequired
            lastName.isValid = false
        } else if (!validateName(lastName.value)) {
            lastName.message = ErrorMessage.lastNameInvalid
            lastName.isValid = false
        } else {
            lastName.message = ""
            lastName.isValid = true
        }
        this.setState({
            lastName
        })
    }

    onPhoneNumberChange = (text) => {
        const phoneNumber = this.state.phoneNumber
        phoneNumber.value = text.trim()

        if (phoneNumber.value.length == 0 || phoneNumber.value == "") {
            phoneNumber.message = ErrorMessage.phoneRequired
            phoneNumber.isValid = false
        } else if (!validatePhone(phoneNumber.value)) {
            phoneNumber.message = ErrorMessage.phoneInvalid
            phoneNumber.isValid = false
        } else {
            phoneNumber.message = ""
            phoneNumber.isValid = true
        }
        this.setState({
            phoneNumber
        })
    }

    isSubmitDisable() {
        return !this.state.firstName.isValid || !this.state.lastName.isValid || !this.state.phoneNumber.isValid || !this.state.isTerms
    }

    onSendOtpClick = async () => {
        const { navigation, screenProps } = this.props;
        const { navigate } = navigation
        if (!screenProps.isConnected) {
            return
        }

        this.setState({ isLoading: true });

        const { firstName, lastName, phoneNumber, countryCode } = this.state;

        try {
            let request = {
                sFirstName: firstName.value,
                sLastName: lastName.value,
                nPhoneNumber: phoneNumber.value,
                nCountryCode: countryCode.replace("+", ""),
                userRoleId: "UR004",
            };

            let response = await API.registerUser(request)
            this.setState({ isLoading: false });
            console.log("registerUser response", response)
            screenProps.callback(response)

            if (response.status) {
                // this.showHideToast(response)
                navigate(Routes.SignUp_Otp, {
                    phoneNumber: phoneNumber.value,
                    countryCode: countryCode
                })
            }
        } catch (error) {
            console.log("registerUser error", error.message);
            this.setState({ isLoading: false });
        }
    }

    // showHideToast = (response) => {
    //     const toastData = this.state.toastData
    //     toastData.isShow = true
    //     toastData.message = response.msg
    //     this.setState({
    //         toastData
    //     }, () => {
    //         toastData.isShow = false
    //         toastData.message = ""
    //         setTimeout(() => {
    //             this.setState({
    //                 toastData
    //             })
    //         }, 5000)
    //     });
    // }
}
