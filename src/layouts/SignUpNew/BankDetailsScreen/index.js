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
import { validateAccountNumber, validateSortcode } from '../../../utils/validation';
import HeaderLeft from '../../../components/Header/HeaderLeft';
import HeaderRight from '../../../components/Header/HeaderRight';
import CustomIcon from '../../../components/CustomIcon';
import TextField from '../../../components/TextField';
import { fontXSmall16 } from '../../../utils/theme';
import InputMask from '../../../components/InputMask';
import API from '../../../API';
import AsyncStorage from '@react-native-community/async-storage';
import ProgressHud from '../../../components/ProgressHud';
import { setStoredData } from '../../../utils/store';


const images = {
    logoImage: require('./../../../assets/Images/logo.png')
}


const BankDetailsScreen = (props, navigation) => {
    const { navigate } = navigation;
    const [showLoader, setLoader] = useState(false);

    const [bankAccNo, setbankAccNo] = useState({
        value: "",
        message: "",
        isValid: false,
    })
    const [sortCode, setsortCode] = useState({
        value: "",
        message: "",
        isValid: false,
    })


    const [accountType, SetAccountType] = useState("");

    useEffect(() => {
        getAccountType();
    }, [])


    const getAccountType = async () => {
        let accountType = await AsyncStorage.getItem('AccountType');
        SetAccountType(accountType);
    }

    const AddBankDetails = async () => {
        let id = await AsyncStorage.getItem('UserKey');
        console.log("The user Id is", id);

        let token = await AsyncStorage.getItem('UserToken');
        let params = {
            userId: id,
            nBankAccNo: bankAccNo.value,
            sSortCode: sortCode.value,
            currentStep: Routes.DocUploadScreen
        };
        console.log("Params are", params);
        try {

            console.log("== accountType ==", accountType);


            let response = accountType !== "Business" ? await API.editProfileIndividual(params) : await API.editProfileBusiness(params)
            setLoader(false);
            console.log("Params are", response);

            if (response.status) {
                await setStoredData(Globals.kUserData, JSON.stringify(response.data))
                props.navigation.navigate(Routes.DocUploadScreen);
            }
            else {
                alert("Please enter the valid Information")
            }
        } catch (err) {
            alert("Please check the Information");
            setLoader(false);
        }

    }



    const onbankAccNoChange = text => {
        const nameValue = bankAccNo;
        nameValue.value = text.trim()

        if (nameValue.value.length == 0 || nameValue.value == '') {
            nameValue.message = ErrorMessage.accountRequired;
            nameValue.isValid = false;
        } else if (!validateAccountNumber(nameValue.value)) {
            nameValue.message = ErrorMessage.accountInvalid;
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
        setbankAccNo(newObj)
    };
    const onsortCodeChange = text => {
        const nameValue = sortCode;
        nameValue.value = text.trim()

        if (nameValue.value.length == 0 || nameValue.value == '') {
            nameValue.message = ErrorMessage.sortcodeRequired;
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
        setsortCode(newObj)
    };


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
                <HeaderRight
                    buttonTitle="Complete Later"
                    buttonColor={Color.DarkGrey}
                    buttonStyle={{ fontSize: fontXSmall16, color: Color.DarkGrey, fontFamily: "Montserrat-Medium", fontWeight: '500' }}
                    onPress={() => {
                        props.navigation.navigate(Routes.DocUploadScreen);
                    }}
                />
            </View>
            <KeyboardAwareScrollView scrollEnabled={true} enableOnAndroid={true} contentContainerStyle={styles.scrollView}>
                <View style={Globals.isIpad ? styles.logoMainViewPad : styles.logoMainView}>
                    <Image source={images.logoImage} style={styles.logoStyle} />
                </View>
                <View style={styles.mainView}>
                    <View style={styles.centerView}>
                        <Label fontSize_20 Montserrat_Light color={Color.DarkGrey}>Connect your business bank account</Label>

                        <InputMask
                            type={'custom'}
                            options={{ mask: '9999999999999' }}
                            placeholder="Bank account no. "
                            onChangeText={onbankAccNoChange}
                            value={bankAccNo.value}
                            keyboardType={'phone-pad'}
                            returnKeyType={"done"}
                            mainContainerStyle={{ width: '100%' }}
                            customStyle={GlobalStyles.textFieldStyle}
                            isCountryCode={false} />
                        {bankAccNo.message !== '' && (
                            <View style={[GlobalStyles.newErrorView, styles.errorView]}>
                                <CustomIcon name={'warning'} style={{ color: Color.Red, fontSize: fontXSmall16, alignItems: 'center', }} />
                                <Label fontSize_14 Montserrat_Regular color={Color.DarkGrey} style={{ paddingLeft: 10 }}>
                                    {bankAccNo.message}
                                </Label>
                            </View>
                        )}
                        <InputMask
                            type={'custom'}
                            options={{ mask: '999999' }}
                            placeholder="Sort code"
                            onChangeText={onsortCodeChange}
                            value={sortCode.value}
                            keyboardType={'phone-pad'}
                            returnKeyType={"done"}
                            mainContainerStyle={{ width: '100%', marginTop: -10 }}
                            customStyle={GlobalStyles.textFieldStyle}
                            isCountryCode={false} />
                        {sortCode.message !== '' && (
                            <View style={[GlobalStyles.newErrorView, styles.errorView]}>
                                <CustomIcon name={'warning'} style={{ color: Color.Red, fontSize: fontXSmall16, alignItems: 'center', }} />
                                <Label fontSize_14 Montserrat_Regular color={Color.DarkGrey} style={{ paddingLeft: 10 }}>
                                    {sortCode.message}
                                </Label>
                            </View>
                        )}

                    </View>
                </View>
                <Image source={require('../../../assets/Images/anime/bankDetails.png')}
                    style={GlobalStyles.animImageStyle}
                />
                <View style={styles.btnPos}>
                    <KMButton
                        fontSize_16 Montserrat_Medium
                        color={Color.BLACK}
                        title="NEXT"
                        textStyle={{ padding: 0 }}
                        style={[styles.lastMainBtn, { backgroundColor: (!bankAccNo.isValid || !sortCode.isValid) ? Color.GreyLightColor : Color.Yellow }]}
                        onPress={() => {
                            setLoader(true);
                            AddBankDetails();
                        }}
                    />
                </View>

            </KeyboardAwareScrollView>
            {showLoader && <ProgressHud />}
        </SafeAreaView >
    )
}

BankDetailsScreen['navigationOptions'] = ({ navigation }) => ({
    headerShown: false
})

export default BankDetailsScreen;