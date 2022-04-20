import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, Image, Text, Alert, TouchableOpacity, ScrollView } from 'react-native';
import Label from '../../../components/Label'
import Color from "../../../utils/color"
import Globals, { ErrorResponse, _calculateAge } from "../../../utils/Globals";
import KMButton from '../../../components/KMButton';
import styles from './styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
// import ToastMessage from '../../components/toastmessage';
import { Routes } from '../../../utils/Routes';
import GlobalStyles from '../../../utils/GlobalStyles';
import HeaderLeft from '../../../components/Header/HeaderLeft';
import { fontLarge24, fontXSmall16, screenWidth } from '../../../utils/theme';
import dateIcon from '../../../assets/Images/dateicon.png';
import DatePicker from 'react-native-datepicker';
import AsyncStorage from '@react-native-community/async-storage';
import API from '../../../API';
import ProgressHud from '../../../components/ProgressHud';
import moment from 'moment'
import { setStoredData } from '../../../utils/store';
import { ErrorMessage } from '../../../utils/message';
import CustomIcon from '../../../components/CustomIcon';

const images = {
    logoImage: require('./../../../assets/Images/logo.png')
}

const DOBScreen = (props, navigation) => {
    const { navigate } = navigation;
    const [DateofBirth, setDateofBirth] = useState({
        value: '',
        message: '',
        isValid: false,
    })
    const [showLoader, setLoader] = useState(false)
    const [accountType, SetAccountType] = useState();



    useEffect(() => {
        getAccountType();
        setLoader(false)
    }, [])

    const getAccountType = async () => {
        let accountType = await AsyncStorage.getItem('AccountType');
        SetAccountType(accountType);
    }

    const AddDOBIndvidual = async () => {
        let id = await AsyncStorage.getItem('UserKey');
        console.log("===The User Id is ", id);
        let token = await AsyncStorage.getItem('UserToken');
        console.log("==Token is", token);


        let params = {
            userId: id,
            dDateofBirth: moment(DateofBirth.value, 'DD/MM/YYYY', true).format("YYYY/MM/DD"),
            tradingName: props?.navigation?.state?.params?.tradingName ? props.navigation.state.params.tradingName : "",
            currentStep: Routes.NationalityScreen
        };

        try {
            let response = await API.editProfileIndividual(params);
            console.log("==DOB Response", response);
            setLoader(false);
            if (response.status) {
                await setStoredData(Globals.kUserData, JSON.stringify(response.data))
                props.navigation.navigate(Routes.NationalityScreen);
            }
            else {
                alert("Invalid Data")
            }
        } catch (err) {
            alert("Please enter valid Information");
            setLoader(false);
        }
    }

    const AddDOBBusiness = async () => {
        let id = await AsyncStorage.getItem('UserKey');
        console.log("===The User ID is", id);
        let token = await AsyncStorage.getItem('UserToken');
        console.log("==Token is", token);
        let params = {
            userId: id,
            dDateofBirth: moment(DateofBirth.value, 'DD/MM/YYYY', true).format("YYYY/MM/DD"),
            currentStep: Routes.NationalityScreen
        };

        try {
            let response = await API.editProfileBusiness(params);
            setLoader(false)
            if (response.status) {
                await setStoredData(Globals.kUserData, JSON.stringify(response.data))
                props.navigation.navigate(Routes.NationalityScreen);
            }
            else {
                alert("Invalid Data")
            }
        } catch (err) {
            alert("Please enter Valid Information")
        }
    }

    var x = new Date();
    x.setFullYear(x.getFullYear() - 18);


    return (
        <SafeAreaView style={styles.container}>
            <View style={GlobalStyles.topCustomHeader}>
                <HeaderLeft
                    iconName="left-arrow"
                    onPress={() => {
                        props.navigation.goBack();
                        setLoader(false);
                    }}
                />
            </View>
            <ScrollView scrollEnabled={true} enableOnAndroid={true} contentContainerStyle={styles.scrollView}>
                <View style={Globals.isIpad ? styles.logoMainViewPad : styles.logoMainView}>
                    <Image source={images.logoImage} style={styles.logoStyle} />
                </View>
                <View style={styles.mainView}>
                    <View style={styles.centerView}>
                        <Label fontSize_20 Montserrat_Light color={Color.DarkGrey}>What’s your date of birth?</Label>
                        <View style={styles.profileMainView}>
                            <DatePicker
                                // disabled={this.state.profileComplete}
                                style={{
                                    width: Globals.isIpad ? 400 : screenWidth - 30,
                                    marginBottom: 20,
                                }}
                                // maxDate={x}
                                date={DateofBirth.value}
                                mode="date"
                                placeholder="Date of birth"
                                format="DD/MM/YYYY"
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                customStyles={{
                                    dateIcon: {
                                        display: 'none',
                                    },
                                    dateText: {
                                        fontSize: fontLarge24,
                                        color: Color.DarkGrey,
                                        fontFamily: 'Montserrat-Regular',
                                    },
                                    placeholderText: {
                                        fontFamily: 'Montserrat-Regular',
                                        fontSize: fontLarge24,
                                    },
                                    dateInput: {
                                        marginLeft: 0,
                                        borderRadius: 4,
                                        height: 48,
                                        alignItems: 'flex-start',
                                        borderColor: Color.LightGrey,
                                        fontFamily: 'Montserrat-Regular',
                                        fontSize: fontLarge24,
                                        borderWidth: 0,
                                        borderBottomWidth: 1
                                    },
                                }}

                                onDateChange={(date, dateObject) => {
                                    isValid = dateObject && _calculateAge(new Date(dateObject)) > 16
                                    message = !isValid ? (dateObject == undefined ? ErrorMessage.dateOfBirthRequired : ErrorMessage.dateOfBirthInvalid) : ''
                                    setDateofBirth({
                                        value: dateObject, message, isValid
                                    })
                                }}

                            />
                            <Image source={dateIcon} style={{ top: 34, right: 4, position: "absolute", height: 20, width: 20 }} />
                        </View>

                        {DateofBirth.message !== "" &&
                            <View style={GlobalStyles.newErrorView}>
                                <CustomIcon name={"warning"} style={{ color: Color.Red, fontSize: fontXSmall16, alignItems: "center" }} />
                                <Label fontSize_14 Montserrat_Regular color={Color.DarkGrey} style={{ paddingLeft: 10, }}>{DateofBirth.message}</Label>
                            </View>
                        }

                    </View>
                </View>
                <Image source={require('../../../assets/Images/anime/profile.png')}
                    style={[GlobalStyles.animImageStyle, styles.AnimImgStyle]}
                />

                <View style={styles.btnPos}>
                    <KMButton
                        fontSize_16 Montserrat_Medium
                        color={Color.BLACK}
                        title="NEXT"
                        textStyle={{ padding: 0 }}
                        disabled={!DateofBirth.isValid}
                        style={[styles.lastMainBtn, { backgroundColor: !DateofBirth.isValid ? Color.GreyLightColor : Color.Yellow }]}
                        onPress={() => {
                            setLoader(true);
                            accountType === 'Individual' ?
                                AddDOBIndvidual()
                                :
                                AddDOBBusiness()

                        }}
                    />
                </View>
            </ScrollView>
            {showLoader && <ProgressHud />}
        </SafeAreaView >
    )
}

DOBScreen['navigationOptions'] = ({ navigation }) => ({
    headerShown: false
})

export default DOBScreen;