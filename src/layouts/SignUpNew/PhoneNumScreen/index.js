import React, {useEffect, useState} from 'react';
import {View, SafeAreaView, Image, Text, KeyboardAvoidingView, TouchableOpacity} from 'react-native';
import Label from '../../../components/Label'
import Color from "../../../utils/color"
import Globals, {ErrorResponse} from "../../../utils/Globals";
import KMButton from '../../../components/KMButton';
import styles from './styles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import ToastMessage from '../../../components/toastmessage';
import {Routes} from '../../../utils/Routes';
import InputMask from '../../../components/InputMask';
import CustomIcon from '../../../components/CustomIcon';
import GlobalStyles from '../../../utils/GlobalStyles';
import {ErrorMessage} from '../../../utils/message';
import {validatePhone} from '../../../utils/validation';
import HeaderLeft from '../../../components/Header/HeaderLeft';
import API from '../../../API';
import ProgressHud from '../../../components/ProgressHud';
import AsyncStorage from '@react-native-community/async-storage';
import {fontXSmall16, fontLarge24} from '../../../utils/theme';

const images = {
    logoImage: require('./../../../assets/Images/logo.png')
}


const PhoneNumScreen = (props, navigation) => {
    const {navigate} = navigation;
    const [toastIsvisible, settoastIsvisible] = useState(false)
    const [accountType, setAccountType] = useState(props.navigation.state.params.SaveAccountType)
    const [phoneNum, setPhoneNum] = useState({
        value: "",
        message: "",
        isValid: false,
    })
    const [countryCode, setcountryCode] = useState('+44')
    const [showLoader, setLoader] = useState(false)

    const onPhoneNumberChange = (text) => {
        const phoneNumber = phoneNum
        phoneNumber.value = text.trim()

        if (phoneNumber.value.length === 0 || phoneNumber.value === "") {
            phoneNumber.message = ErrorMessage.phoneRequired
            phoneNumber.isValid = false
        } else if (!validatePhone(phoneNumber.value)) {
            phoneNumber.message = ErrorMessage.phoneInvalid
            phoneNumber.isValid = false
        } else {
            phoneNumber.message = ""
            phoneNumber.isValid = true
        }
        const newObj = {
            value: phoneNumber.value,
            message: phoneNumber.message,
            isValid: phoneNumber.isValid
        }
        setPhoneNum(newObj)
    }
    const sendOtp = async () => {
        const {screenProps} = props;
        setLoader(true);
        const params = { nPhoneNumber: phoneNum.value, nCountryCode: countryCode, sAccountType: accountType, currentStep: Routes.EmailScreen }
        console.log('PARAMS ARE', params);
        try {
            let response = await API.userRegister(params);
            console.log("===== response =====", response)
            if (response.status) {
                //settoastIsvisible(true)
                await AsyncStorage.setItem('UserKey', response.data._id)
                // setTimeout(() => {
                //     settoastIsvisible(false)
                //     props.navigation.navigate(Routes.OTPScreen, { nPhoneNumber: phoneNum.value, nOtp: response.data.nOtp, countryCode: countryCode })
                // }, 3000)
                props.navigation.navigate(Routes.OTPScreen, {nPhoneNumber: phoneNum.value, nOtp: response.data.nOtp, countryCode: countryCode})

            } else {
                // alert(response.msg);
                screenProps.callback({status: false, msg: response.msg});
            }
            setLoader(false);
        } catch (err) {
            setLoader(false);
            if (err.message) {
                screenProps.callback({status: false, msg: err.message});
            }
            console.log("OTP Error", err.message);
        }
    }

    return (

        <SafeAreaView style={styles.container}>
            <View style={GlobalStyles.topCustomHeader}>
                <HeaderLeft
                    iconName="left-arrow"
                    onPress={() => {
                        props.navigation.goBack();
                    }}
                />
            </View>
            <KeyboardAwareScrollView scrollEnabled={true} enableOnAndroid={true} contentContainerStyle={styles.scrollView}>
                <View style={Globals.isIpad ? styles.logoMainViewPad : styles.logoMainView}>
                    <Image source={images.logoImage} style={Globals.isIpad ? styles.logoStylePad : styles.logoStyle} />
                </View>
                <View style={styles.mainView}>
                    <View style={styles.centerView}>
                        <Label fontSize_20 Montserrat_Light color={Color.DarkGrey}  >What’s your phone number?</Label>
                        <InputMask
                            type={'custom'}
                            options={{mask: '9999999999999'}}
                            placeholder='Phone no.'
                            onChangeText={onPhoneNumberChange}
                            value={phoneNum.value}
                            keyboardType={"phone-pad"}
                            returnKeyType={"done"}
                            mainContainerStyle={{borderBottomWidth: 1, borderColor: Color.GreyLightColor, width: '100%'}}
                            countryCodeContainerStyle={{borderWidth: 0}}
                            customStyle={{width: "77%", height: 48, borderWidth: 0, color: Color.DarkGrey, fontFamily: "Montserrat-Regular", fontSize: fontLarge24}}
                            countryCodeTxtStyle={{color: Color.DarkGrey, fontSize: fontLarge24, fontFamily: "Montserrat-Light"}}
                            isCountryCode={true}
                            reference={ref => this.phone = ref}
                            countryCode={countryCode}
                            autoFocus={true}
                            // onSelectCounstry={() => this.setState({ countryCode: this.phone.getValue() })}
                            onSelectCountry={() => setcountryCode(this.phone.getValue())}

                        />
                        {phoneNum.message !== "" &&
                            <View style={GlobalStyles.newErrorView}>
                                <CustomIcon name={"warning"} style={GlobalStyles.errorIcon} />
                                <Label fontSize_14 Montserrat_Regular color={Color.DarkGrey} >{phoneNum.message}</Label>
                            </View>

                        }

                    </View>
                </View>
                <Image source={require('../../../assets/Images/anime/phoneNo.png')}
                    style={GlobalStyles.animImageStyle}
                />
                <View style={styles.btnPos}>
                    <KMButton
                        fontSize_16 Montserrat_Medium
                        color={Color.BLACK}
                        title="SEND OTP"
                        textStyle={{padding: 0}}
                        disabled={!phoneNum.isValid}
                        style={[styles.lastMainBtn, {backgroundColor: phoneNum.isValid ? Color.Yellow : Color.GreyLightColor}]}
                        onPress={() => {
                            sendOtp();
                        }}
                    />
                </View>

            </KeyboardAwareScrollView>
            <ToastMessage
                message="OTP Sent!"
                mainViewCustom={{alignItems: 'center'}}
                isVisible={toastIsvisible} />
            {showLoader && <ProgressHud />}

        </SafeAreaView >
    )
}

PhoneNumScreen['navigationOptions'] = ({navigation}) => ({
    headerShown: false
})

export default PhoneNumScreen;