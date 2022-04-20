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
import HeaderLeft from '../../../components/Header/HeaderLeft';
import { Dropdown } from 'react-native-material-dropdown';
import countryData from "../../../../countries.json";
import { fontXSmall16, screenHeight } from '../../../utils/theme';
import TextField from '../../../components/TextField';
import { ErrorMessage } from '../../../utils/message';
import { validateCharacter, validateAccountNumber, validateName } from '../../../utils/validation';
import CustomIcon from '../../../components/CustomIcon';
import AsyncStorage from '@react-native-community/async-storage';
import InputMask from '../../../components/InputMask';
import API from '../../../API';
import ProgressHud from '../../../components/ProgressHud';
import { setStoredData } from '../../../utils/store';



const images = {
    logoImage: require('./../../../assets/Images/logo.png')
}


const BusinessNameScreen = (props, navigation) => {
    const { navigate } = navigation;

    const [showLoader, setLoader] = useState(false)


    const [businessName, setbusinessName] = useState({
        value: "",
        message: "",
        isValid: false,
    })

    const [businessNumber, setBusinessNumber] = useState({
        value: "",
        message: "",
        isValid: false,
    })

    const onbusinessNameChange = text => {
        const nameValue = businessName;
        nameValue.value = text.trim()

        if (nameValue.value.length == 0 || nameValue.value == '') {
            nameValue.message = ErrorMessage.businessNameRequired;
            nameValue.isValid = false;
        } else if (!validateName(nameValue.value)) {
            nameValue.message = ErrorMessage.firstNameInvalid;
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
        setbusinessName(newObj)
    };

    const onbusinessNumberChange = text => {
        const nameValue = businessNumber;
        nameValue.value = text.trim()

        if (nameValue.value.length == 0 || nameValue.value == '') {
            nameValue.message = ErrorMessage.businessNumberRequired;
            nameValue.isValid = false;
        }

        // else if (!validateAccountNumber(nameValue.value)) {
        //     nameValue.message = ErrorMessage.accountInvalid;
        //     nameValue.isValid = false;
        // } 

        else {
            nameValue.message = '';
            nameValue.isValid = true;
        }
        const newObj = {
            value: nameValue.value,
            message: nameValue.message,
            isValid: nameValue.isValid
        }
        setBusinessNumber(newObj)
    };


    const AddBusiness = async () => {
        setLoader(true)
        let userID = await AsyncStorage.getItem('UserKey');
        let userData = await AsyncStorage.getItem(Globals.kUserData);

        const params = {
            userId: userID,
            currentStep: Routes.BankDetailsScreen,
            oCompanyDetail: JSON.stringify({
                sCompanyNumber: businessNumber.value,
                sCompanyName: businessName.value,
                sCompanyEmail: JSON.parse(userData).sEmail
            })
        };

        console.log("********", params);

        try {
            let response = await API.editProfileBusiness(params);
            setLoader(false);
            if (response.status) {
                await setStoredData(Globals.kUserData, JSON.stringify(response.data))
                props.navigation.navigate(Routes.BankDetailsScreen);
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
                    }}
                />
            </View>
            <KeyboardAwareScrollView scrollEnabled={false} enableOnAndroid={true} contentContainerStyle={styles.scrollView}>
                <View style={Globals.isIpad ? styles.logoMainViewPad : styles.logoMainView}>
                    <Image source={images.logoImage} style={styles.logoStyle} />
                </View>
                <View style={styles.mainView}>
                    <View style={styles.centerView}>
                        <Label fontSize_20 Montserrat_Light color={Color.DarkGrey}>Enter registered business name </Label>
                        <View style={{ position: 'relative' }}>

                            <TextField
                                placeholder='Business name'
                                onChangeText={onbusinessNameChange}
                                customStyle={GlobalStyles.textFieldStyle}
                                labelStyle={{ marginBottom: 0 }}
                                value={businessName}
                                autoFocus={true}
                            >
                                {businessName.message !== "" &&
                                    <View style={GlobalStyles.newErrorView}>
                                        <CustomIcon name={"warning"} style={{ color: Color.Red, fontSize: fontXSmall16, alignItems: "center" }} />
                                        <Label fontSize_14 Montserrat_Regular color={Color.DarkGrey} style={{ paddingLeft: 10, }}>{businessName.message}</Label>
                                    </View>
                                }
                            </TextField>



                            <InputMask
                                type={'custom'}
                                options={{ mask: 'SSSSSSSSSSSSSSSS' }}
                                placeholder="Company no."
                                onChangeText={onbusinessNumberChange}
                                value={businessNumber.value}
                                // keyboardType={'phone-pad'}
                                returnKeyType={"done"}
                                customStyle={GlobalStyles.textFieldStyle}
                                isCountryCode={false} />
                            {businessNumber.message !== '' && (
                                <View style={[GlobalStyles.newErrorView, styles.errorView]}>
                                    <CustomIcon name={'warning'} style={{ color: Color.Red, fontSize: fontXSmall16, alignItems: 'center', }} />
                                    <Label fontSize_14 Montserrat_Regular color={Color.DarkGrey} style={{ paddingLeft: 10 }}>
                                        {businessNumber.message}
                                    </Label>
                                </View>
                            )}

                        </View>
                    </View>
                </View>


                <View style={styles.btnPos}>
                    <KMButton
                        fontSize_16 Montserrat_Medium
                        color={Color.BLACK}
                        title="NEXT"
                        textStyle={{ padding: 0 }}
                        disabled={!(businessName.isValid && businessNumber.isValid)}
                        style={[styles.lastMainBtn, { backgroundColor: !(businessName.isValid && businessNumber.isValid) ? Color.GreyLightColor : Color.Yellow }]}
                        onPress={() => {
                            AddBusiness();
                        }}
                    />
                </View>
            </KeyboardAwareScrollView>

            {showLoader && <ProgressHud />}

        </SafeAreaView >
    )
}

BusinessNameScreen['navigationOptions'] = ({ navigation }) => ({
    headerShown: false
})

export default BusinessNameScreen;