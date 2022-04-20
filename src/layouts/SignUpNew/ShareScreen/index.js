import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, Image, Text, Alert, TouchableOpacity, ScrollView } from 'react-native';
import Label from '../../../components/Label'
import Color from "../../../utils/color"
import Globals, { ErrorResponse } from "../../../utils/Globals";
import KMButton from '../../../components/KMButton';
import styles from './styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
// import ToastMessage from '../../components/toastmessage';
import { Routes } from '../../../utils/Routes';
import GlobalStyles from '../../../utils/GlobalStyles';
import HeaderLeft from '../../../components/Header/HeaderLeft';
import HeaderRight from '../../../components/Header/HeaderRight';
import ImagePicker from 'react-native-image-crop-picker';
import { fontXSmall16 } from '../../../utils/theme';
import uploadBtn from '../../../assets/Images/cloudUpload.png';
import CustomIcon from '../../../components/CustomIcon';
import InputMask from '../../../components/InputMask';
import { validateSortcode } from '../../../utils/validation';
import { ErrorMessage } from '../../../utils/message';
import Share from 'react-native-share';
import { getStoredData } from '../../../utils/store';
import API from '../../../API';
import AsyncStorage from '@react-native-community/async-storage';
import ProgressHud from '../../../components/ProgressHud';




const images = {
    logoImage: require('./../../../assets/Images/logo.png')
}


const ShareScreen = (props, navigation) => {
    const { navigate } = navigation;

    const [userData, setUserData] = useState("")
    const [showLoader, setLoader] = useState(false);


    const [referNo, setreferNo] = useState({
        value: "",
        message: "",
        isValid: false,
    })
    const [applist, setApplist] = useState([

        {
            appImg: require('./../../../assets/Images/gmailIcon.png'),
            appName: 'Gmail'
        },
        {
            appImg: require('./../../../assets/Images/facebook.png'),
            appName: 'FaceBook'
        },
        {
            appImg: require('./../../../assets/Images/whatsapp.png'),
            appName: 'WhatsApp'
        }

    ])

    const onreferNoChange = text => {
        const nameValue = referNo;
        nameValue.value = text.trim()

        if (nameValue.value.length == 0 || nameValue.value == '') {
            nameValue.message = ErrorMessage.accountRequired;
            nameValue.isValid = false;
        } else if (!validateSortcode(nameValue.value)) {
            nameValue.message = ErrorMessage.sortcodeInvalid;
            nameValue.isValid = false;
        } else {
            nameValue.message = '';
            nameValue.isValid = true;
        }
        const newObj = {
            value: nameValue.value,
            message: nameValue.message,
            isValid: nameValue.isValid
        }

        console.log("== new object ==", newObj)

        setreferNo(newObj)
    };

    const onPressShare = () => {
        Share.open({
            title: 'PongoPay Referral code: ' + (userData && userData.refferalCode) || "No Code",
            message: 'PongoPay Referral code: ' + (userData && userData.refferalCode) || "No Code",
            url: "",
        })
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                err && console.log(err);
            });
    }

    const submitReferral = async () => {
        setLoader(true);

        let id = await AsyncStorage.getItem('UserKey');
        const params = { referralCode: referNo.value, user_id: id }
        console.log("+++++++++++", params);

        try {
            let response = await API.submitReferral(params);
            console.log("+++++++++++", response);
            if (response.status) {
                // settoastIsvisible(true)
                // await AsyncStorage.setItem('UserKey', response.data._id)
                // setTimeout(() => {
                //     settoastIsvisible(false)
                //     props.navigation.navigate(Routes.OTPScreen, { nPhoneNumber: phoneNum.value, nOtp: response.data.nOtp, countryCode: countryCode })
                // }, 3000)
                alert(response.msg);
            } else {
                alert(response.msg);
            }
            setLoader(false);
        } catch (err) {
            alert("OTP error");
            setLoader(false);
            console.log("OTP Error", err.message);
        }
    }


    useEffect(() => {
        const userData = async () => {
            let userData = JSON.parse(await getStoredData(Globals.kUserData))
            setUserData(userData)
        }
        userData()
    }, [])


    const singleShare = async (index) => {

        var social = Share.Social.EMAIL

        if (index === 0) {
            social = Share.Social.EMAIL
        } else if (index === 1) {
            social = Share.Social.FACEBOOK
        } else {
            social = Share.Social.WHATSAPP
        }

        const shareOptions = {
            title: 'PongoPay Referral code: ' + (userData && userData.refferalCode) || "No Code",
            message: 'PongoPay Referral code: ' + (userData && userData.refferalCode) || "No Code",
            url: "",
            social: social,
            failOnCancel: false,
        };

        try {
            const ShareResponse = await Share.shareSingle(shareOptions);
            console.log("--- success ----", ShareResponse)

        } catch (error) {
            // console.log('Error =>', getErrorString(error));
        }
    };



    return (
        <SafeAreaView style={styles.container}>
            <View style={GlobalStyles.topCustomHeader}>
                <HeaderLeft
                    iconName="left-arrow"
                    onPress={() => {
                        props.navigation.goBack();
                    }}
                />
                <HeaderRight
                    buttonTitle="Skip"
                    buttonColor={Color.DarkGrey}
                    buttonStyle={{ fontSize: fontXSmall16, color: Color.DarkGrey, fontFamily: "Montserrat-Medium", fontWeight: '500' }}
                    onPress={() => {
                        props.navigation.navigate(Routes.CongratsScreen)
                    }}
                />
            </View>
            <ScrollView scrollEnabled={true} enableOnAndroid={true} contentContainerStyle={styles.scrollView}>
                <View style={Globals.isIpad ? styles.logoMainViewPad : styles.logoMainView}>
                    <Image source={images.logoImage} style={styles.logoStyle} />
                </View>
                <View style={styles.mainView}>
                    <View style={styles.centerView}>
                        <Label fontSize_20 Montserrat_Light color={Color.DarkGrey}>Do you have a referral code?</Label>
                        <View style={styles.codeMainView}>

                            <View style={styles.inputMaskView}>
                                <TouchableOpacity
                                    disabled={referNo.value.length < 6}
                                    onPress={() => {
                                        console.log("=== referNo ===", referNo.value)
                                        submitReferral()
                                    }}
                                    style={styles.submitBtn}>
                                    <Text
                                        style={{
                                            fontSize: fontXSmall16,
                                            color: referNo.value.length < 6 ? '#87B4E4' : Color.DarkBlue,
                                            opacity: referNo.value.length < 6 ? 0.6 : 1
                                        }}>Submit</Text>
                                </TouchableOpacity>
                                <InputMask
                                    type={'custom'}
                                    options={{ mask: '***************' }}
                                    placeholder="eg-879545"
                                    onChangeText={onreferNoChange}
                                    value={referNo.value}
                                    // keyboardType={'phone-pad'}
                                    returnKeyType={"done"}
                                    mainContainerStyle={{ width: '100%' }}
                                    customStyle={GlobalStyles.textFieldStyle}
                                    isCountryCode={false} />
                                {/* {referNo.message !== '' && (
                                    <View style={[GlobalStyles.newErrorView, styles.errorView]}>
                                        <CustomIcon name={'warning'} style={{ color: Color.Red, fontSize: fontXSmall16, alignItems: 'center', }} />
                                        <Label fontSize_14 Montserrat_Regular color={Color.DarkGrey} style={{ paddingLeft: 10 }}>
                                            {referNo.message}
                                        </Label>
                                    </View>
                                )} */}
                            </View>
                            <Label fontSize_18 Montserrat_Light color={Color.DarkGrey}>
                                Enter a referral code and we’ll send you<Label fontSize_18 Montserrat_Medium color={Color.BLACK}> £30 in cash</Label> once you complete your first job.
                            </Label>
                            <View style={styles.inputMaskView}>
                                <TouchableOpacity style={styles.yellowBtn}
                                    onPress={onPressShare}>
                                    <Text style={styles.shareTxt}>Share code</Text>
                                    <Image source={require('../../../assets/Images/shareImg.png')}
                                        style={styles.shareImg}
                                    />
                                </TouchableOpacity>
                                <InputMask
                                    type={'custom'}
                                    options={{ mask: '**********' }}
                                    disabled
                                    value={(userData && userData.refferalCode) || "No Code"}
                                    mainContainerStyle={{ width: '100%' }}
                                    customStyle={GlobalStyles.textFieldStyle}
                                    isCountryCode={false} />
                            </View>

                            {/* <View style={styles.appView}>

                                {applist.map((appData, index) => {
                                    return <TouchableOpacity onPress={() => singleShare(index)} style={{ flexDirection: 'column', marginRight: 14, alignItems: 'center' }}>
                                        <Image source={appData.appImg} style={styles.appImg} />
                                        <Label fontSize_14 Montserrat_Regular color={Color.BLACK}>{appData.appName}</Label>
                                    </TouchableOpacity>
                                })}
                            </View> */}
                        </View>
                    </View>
                </View>
                <View style={styles.btnPos}>
                    <KMButton
                        fontSize_16 Montserrat_Medium
                        color={Color.BLACK}
                        title="NEXT"
                        textStyle={{ padding: 0 }}
                        style={[styles.lastMainBtn, { backgroundColor: Color.Yellow }]}
                        onPress={() => props.navigation.navigate(Routes.CongratsScreen)}
                    />
                </View>

            </ScrollView>

            {showLoader && <ProgressHud />}

        </SafeAreaView >
    )
}

ShareScreen['navigationOptions'] = ({ navigation }) => ({
    headerShown: false
})

export default ShareScreen;