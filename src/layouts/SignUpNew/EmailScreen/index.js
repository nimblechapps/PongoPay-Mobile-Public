import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, Image, Text, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import Label from '../../../components/Label'
import Color from "../../../utils/color"
import Globals, { ErrorResponse } from "../../../utils/Globals";
import KMButton from '../../../components/KMButton';
import styles from './styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
// import ToastMessage from '../../components/toastmessage';
import { Routes } from '../../../utils/Routes';
import GlobalStyles from '../../../utils/GlobalStyles';
import { ErrorMessage } from '../../../utils/message';
import { validateEmail } from '../../../utils/validation';
import HeaderLeft from '../../../components/Header/HeaderLeft';
import CustomIcon from '../../../components/CustomIcon';
import TextField from '../../../components/TextField';
import { fontLarge24, fontXSmall16 } from '../../../utils/theme';
import AsyncStorage from '@react-native-community/async-storage';
import API from '../../../API';
import ProgressHud from '../../../components/ProgressHud';
import { setStoredData } from '../../../utils/store';


const images = {
    logoImage: require('./../../../assets/Images/logo.png')
}


const EmailScreen = (props, navigation) => {
    const { navigate, screenProps } = navigation;
    const [showLoader, setLoader] = useState(false);


    const [accountType, SetAccountType] = useState()
    useEffect(() => {
        getAccountType()
    }, [])

    const getAccountType = async () => {
        let accountType = await AsyncStorage.getItem('AccountType')
        SetAccountType(accountType)
    }
    const [email, setEmail] = useState({
        value: "",
        message: "",
        isValid: false,
    })




    const onEmailChange = text => {
        const emailAddress = email;
        emailAddress.value = text.trim()

        if (emailAddress.value.length == 0 || email.value == '') {
            emailAddress.message = ErrorMessage.emailRequired;
            emailAddress.isValid = false;
        } else if (!validateEmail(email.value)) {
            emailAddress.message = ErrorMessage.emailInvalid_New;
            emailAddress.isValid = false;
        } else {
            emailAddress.message = '';
            emailAddress.isValid = true;
        }
        const newObj = {
            value: emailAddress.value,
            message: emailAddress.message,
            isValid: emailAddress.isValid
        }
        setEmail(newObj)
    };


    const MailVerificationForIndividual = async () => {

        let id = await AsyncStorage.getItem('UserKey');
        let token = await AsyncStorage.getItem('UserToken');
        let actype = await AsyncStorage.getItem("AccountType");

        const params = { sEmail: email.value, sAccountType: actype, userId: id, currentStep: Routes.NameScreen }
        console.log("The Params are", params);

        try {
            let response = await API.editProfileIndividual(params);

            console.log("===== response =====", response)

            setLoader(false);
            if (response.status) {
                await setStoredData(Globals.kUserData, JSON.stringify(response.data))
                props.navigation.navigate(Routes.NameScreen);
            }
            else {
                alert(response.msg)
            }
        } catch (err) {
            console.log("ERROR MESSAGE", err.message);
            setLoader(false);
        }
    }

    const MailVerificationForBusiness = async () => {
        console.log("===BUSINESS MAIL VERFICATION");

        let data2 = await AsyncStorage.getItem('UserKey');
        console.log("The user Id is ", data2);

        let token = await AsyncStorage.getItem('UserToken');
        console.log("The user Token is", token);
        let actype1 = await AsyncStorage.getItem("AccountType");
        console.log("===The Account Type is", actype1)

        const params = { sEmail: email.value, sAccountType: actype1, userId: data2, currentStep: Routes.NameScreen };
        console.log("THE PARAMS ARE", params);

        try {
            let response = await API.editProfileBusiness(params);
            console.log("===Response for the Business", response);
            setLoader(false);
            if (response.status) {
                props.navigation.navigate(Routes.NameScreen);
            }
            else {
                alert("Please Check the Information")
            }
        } catch (err) {
            console.log("===Error message", err.message);
        }

    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={GlobalStyles.topCustomHeader}>
                <HeaderLeft
                    iconName="left-arrow"
                    onPress={() => {
                        props.navigation.goBack();
                        setLoader(false)
                    }}
                />
            </View>
            <KeyboardAwareScrollView scrollEnabled={true} enableOnAndroid={true} contentContainerStyle={Globals.isIpad ? styles.scrollViewPad : styles.scrollView}>
                <View style={Globals.isIpad ? styles.logoMainViewPad : styles.logoMainView}>
                    <Image source={images.logoImage} style={styles.logoStyle} />
                </View>
                <View style={styles.mainView}>
                    <View style={styles.centerView}>
                        <Label fontSize_20 Montserrat_Light color={Color.DarkGrey}>Next we'll need your email address </Label>
                        <View>
                            <TextField
                                placeholder='Email Address'
                                onChangeText={onEmailChange}
                                customStyle={GlobalStyles.textFieldStyle}
                                value={email}
                                autoFocus={true}
                                autoCapitalize='none'                                
                                keyboardType={'email-address'}
                            >
                                {email.message !== "" &&
                                    <View style={GlobalStyles.newErrorView}>
                                        <CustomIcon name={"warning"} style={{ color: Color.Red, fontSize: fontXSmall16, alignItems: "center" }} />
                                        <Label fontSize_14 Montserrat_Regular color={Color.DarkGrey} style={{ paddingLeft: 10, }}>{email.message}</Label>
                                    </View>
                                }
                            </TextField>
                        </View>
                    </View>
                </View>
                <Image source={require('../../../assets/Images/anime/email.png')}
                    style={GlobalStyles.animImageStyle}
                />
                <View style={styles.btnPos}>
                    <KMButton
                        fontSize_16 Montserrat_Medium
                        color={Color.BLACK}
                        title="NEXT"
                        textStyle={{ padding: 0 }}
                        disabled={!email.isValid}
                        style={[styles.lastMainBtn, { backgroundColor: email.isValid ? Color.Yellow : Color.GreyLightColor }]}
                        onPress={() => {
                            setLoader(true);
                            accountType === 'Individual' ?
                                MailVerificationForIndividual()
                                :
                                MailVerificationForBusiness()

                        }}
                    />
                </View>

            </KeyboardAwareScrollView>
            {showLoader && <ProgressHud />}
        </SafeAreaView >
    )
}

EmailScreen['navigationOptions'] = ({ navigation }) => ({
    headerShown: false
})

export default EmailScreen;